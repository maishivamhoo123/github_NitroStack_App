import { Injectable } from '@nitrostack/core';
import axios from 'axios';

@Injectable()
export class GitHubService {
    private readonly baseUrl = 'https://api.github.com';
    private readonly headers: Record<string, string>;

    constructor() {
        this.headers = {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }

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

    async getPRDetails(owner: string, repo: string, prNumber: number) {
        const [prResponse, reviewsResponse] = await Promise.all([
            axios.get(`${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}`, {
                headers: this.headers
            }),
            axios.get(`${this.baseUrl}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
                headers: this.headers
            })
        ]);
        return { pr: prResponse.data, reviews: reviewsResponse.data };
    }

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

    async getContributorStats(username: string) {
        const [userResponse, mergedResponse] = await Promise.all([
            axios.get(`${this.baseUrl}/users/${username}`, {
                headers: this.headers
            }),
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
}