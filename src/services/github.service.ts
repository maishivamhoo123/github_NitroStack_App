import { Injectable } from '@nitrostack/core';
import axios from 'axios';

@Injectable()
export class GitHubService {
    private readonly baseUrl = 'https://api.github.com';
    private readonly headers: Record<string, string>;

    constructor() {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
        }
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }

    /**
     * Search repositories by keyword, language, and minimum stars.
     */
    async searchRepositories(keyword: string, language?: string, stars?: number, limit = 10) {
        let q = keyword;
        if (language) q += ` language:${language}`;
        if (stars) q += ` stars:>=${stars}`;
        const { data } = await axios.get(`${this.baseUrl}/search/repositories`, {
            headers: this.headers,
            params: { q, sort: 'stars', order: 'desc', per_page: limit }
        });
        return data.items.map((item: any) => ({
            name: item.name,
            full_name: item.full_name,
            stars: item.stargazers_count,
            language: item.language,
            description: item.description,
            url: item.html_url,
        }));
    }

    /**
     * Get metadata about a repository.
     */
    async getRepositoryInfo(repo: string) {
        const [owner, name] = repo.split('/');
        const { data: repoData } = await axios.get(`${this.baseUrl}/repos/${owner}/${name}`, {
            headers: this.headers
        });
        let latestRelease: string | null = null;
        try {
            const { data: release } = await axios.get(`${this.baseUrl}/repos/${owner}/${name}/releases/latest`, {
                headers: this.headers
            });
            latestRelease = release.tag_name;
        } catch {
            // No releases yet
        }
        return {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            open_issues: repoData.open_issues_count,
            default_branch: repoData.default_branch,
            description: repoData.description,
            latest_release: latestRelease,
            license: repoData.license?.spdx_id || null,
        };
    }

    /**
     * Get open PRs for a user.
     */
    async getUserOpenPRs(username: string, limit: number = 10) {
        const response = await axios.get(`${this.baseUrl}/search/issues`, {
            headers: this.headers,
            params: {
                q: `type:pr state:open author:${username}`,
                per_page: limit,
                sort: 'updated',
                order: 'desc'
            }
        });
        return response.data;
    }

    /**
     * Get PR details and reviews.
     */
    async getPRDetails(owner: string, repo: string, prNumber: number) {
        const [prResponse, reviewsResponse] = await Promise.all([
            axios.get(`${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, { headers: this.headers })
        ]);
        return { pr: prResponse.data, reviews: reviewsResponse.data };
    }

    /**
     * Find good first issues.
     */
    async findGoodFirstIssues(repo: string, limit: number = 10) {
        const [owner, repoName] = repo.split('/');
        const response = await axios.get(`${this.baseUrl}/repos/${owner}/${repoName}/issues`, {
            headers: this.headers,
            params: {
                labels: 'good first issue',
                state: 'open',
                per_page: limit,
                sort: 'created',
                order: 'desc'
            }
        });
        return response.data;
    }

    /**
     * Get contributor stats.
     */
    async getContributorStats(username: string) {
        const [userResponse, mergedResponse] = await Promise.all([
            axios.get(`${this.baseUrl}/users/${username}`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/search/issues`, {
                headers: this.headers,
                params: {
                    q: `type:pr state:closed author:${username} is:merged`,
                    per_page: 1
                }
            })
        ]);
        return {
            user: userResponse.data,
            mergedPRs: mergedResponse.data.total_count
        };
    }

    /**
     * Calculate repository health score (0-100).
     */
    async getRepoHealth(repo: string) {
        const [owner, name] = repo.split('/');
        const [repoData, issues, pulls] = await Promise.all([
            axios.get(`${this.baseUrl}/repos/${owner}/${name}`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/issues?state=open&per_page=100`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/pulls?state=open&per_page=100`, { headers: this.headers })
        ]);

        const staleDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const staleIssues = issues.data.filter((i: any) => i.pull_request === undefined && new Date(i.updated_at) < staleDate);
        const stalePRs = pulls.data.filter((p: any) => new Date(p.updated_at) < staleDate);

        let score = 100;
        // Deduct for stale issues/PRs
        score -= Math.min(20, staleIssues.length * 2);
        score -= Math.min(20, stalePRs.length * 2);
        if (!repoData.data.license) score -= 10;
        if (!repoData.data.description) score -= 10;

        // Approximate maintainers count (in a real app, check contributors or commit authors)
        const maintainers = repoData.data.owner.type === 'Organization' ? Math.min(staleIssues.length > 0 ? 5 : 3, 5) : 1;
        if (maintainers < 2) score -= 15;

        return {
            health_score: Math.max(0, score),
            stale_issues_count: staleIssues.length,
            stale_prs_count: stalePRs.length,
            average_issue_response_time_hours: 0, // would need timeline API
            has_documentation: Boolean(repoData.data.description),
            maintainers_count: maintainers,
            ci_status: null, // additional API call would be needed
            license: repoData.data.license?.spdx_id || null,
            release_frequency: 'unknown', // require release analysis
        };
    }

    /**
     * Recommend repositories based on user interests.
     */
    async recommendRepositories(interests: string[]) {
        const results: any[] = [];
        for (const interest of interests) {
            const { data } = await axios.get(`${this.baseUrl}/search/repositories`, {
                headers: this.headers,
                params: {
                    q: interest,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 3
                }
            });
            for (const item of data.items) {
                results.push({
                    name: item.name,
                    full_name: item.full_name,
                    description: item.description,
                    stars: item.stargazers_count,
                    why: `Matches your interest in ${interest}`,
                });
            }
        }
        // Deduplicate by full_name
        const seen = new Set();
        return results.filter(r => {
            if (seen.has(r.full_name)) return false;
            seen.add(r.full_name);
            return true;
        });
    }

    /**
     * Build a daily contribution dashboard for a user.
     */
    async getDailyDashboard(username: string) {
        const searchPRs = (q: string) =>
            axios.get(`${this.baseUrl}/search/issues`, {
                headers: this.headers,
                params: { q: `${q} author:${username} type:pr`, per_page: 5, sort: 'updated', order: 'desc' }
            });
        const searchReviews = () =>
            axios.get(`${this.baseUrl}/search/issues`, {
                headers: this.headers,
                params: { q: `type:pr review-requested:${username}`, per_page: 5 }
            });
        const searchIssues = () =>
            axios.get(`${this.baseUrl}/search/issues`, {
                headers: this.headers,
                params: { q: `type:issue assignee:${username}`, per_page: 5 }
            });
        const [activePRsRes, pendingReviewsRes, assignedIssuesRes, mergedRes] = await Promise.all([
            searchPRs('is:open'),
            searchReviews(),
            searchIssues(),
            searchPRs('is:merged'),
        ]);

        const toItems = (res: any) => res.data.items.map((i: any) => ({
            title: i.title,
            url: i.html_url,
            repo: i.repository_url.replace('https://api.github.com/repos/', ''),
        }));

        return {
            active_prs: toItems(activePRsRes),
            pending_reviews: toItems(pendingReviewsRes),
            assigned_issues: toItems(assignedIssuesRes),
            recent_merged_prs: toItems(mergedRes),
            repositories_needing_attention: [], // could be enhanced
        };
    }

    /**
     * Get activity summary for a repo.
     */
    async getActivitySummary(repo: string) {
        const [owner, name] = repo.split('/');
        const [commitsRes, releasesRes, issuesRes, pullsRes] = await Promise.all([
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/commits?per_page=5`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/releases?per_page=3`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/issues?state=open&per_page=5`, { headers: this.headers }),
            axios.get(`${this.baseUrl}/repos/${owner}/${name}/pulls?state=open&per_page=5`, { headers: this.headers }),
        ]);

        const contributors = commitsRes.data.map((c: any) => c.author?.login).filter(Boolean);
        const topContributors = [...new Set(contributors)].slice(0, 5);

        return {
            recent_commits: commitsRes.data.map((c: any) => c.commit.message),
            recent_releases: releasesRes.data.map((r: any) => r.tag_name),
            newest_issues: issuesRes.data.map((i: any) => i.title),
            newest_pull_requests: pullsRes.data.map((p: any) => p.title),
            top_contributors: topContributors as string[],
        };
    }
}