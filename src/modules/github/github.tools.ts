import { ToolDecorator as Tool, ExecutionContext, z, Injectable } from '@nitrostack/core';
import { GitHubService } from '../../services/github.service.js';

@Injectable({ deps: [GitHubService] })
export class GitHubTools {
    constructor(private githubService: GitHubService) {}

    // 1. Search Repositories
    @Tool({
        name: 'search_repositories',
        description: 'Search GitHub repositories by keyword, language, and minimum stars.',
        inputSchema: z.object({
            keyword: z.string().describe('Search term'),
            language: z.string().optional().describe('Filter by programming language'),
            stars: z.number().min(0).optional().describe('Minimum number of stars'),
            limit: z.number().min(1).max(100).default(10).describe('Max results')
        })
    })
    async searchRepositories(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Searching repositories', input);
        const repos = await this.githubService.searchRepositories(
            input.keyword, input.language, input.stars, input.limit
        );
        return { count: repos.length, repositories: repos };
    }

    // 2. Find Good First Issues
    @Tool({
        name: 'find_good_first_issues',
        description: 'Find open issues labeled "good first issue" or "help wanted" in a repository.',
        inputSchema: z.object({
            repo: z.string().describe('Full repo name (owner/repo)'),
            limit: z.number().min(1).max(20).default(10).describe('Number of issues')
        })
    })
    async findGoodFirstIssues(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Finding good first issues', { repo: input.repo });
        const issues = await this.githubService.findGoodFirstIssues(input.repo, input.limit);
        return {
            repo: input.repo,
            count: issues.length,
            issues: issues.map((issue: any) => ({
                title: issue.title,
                number: issue.number,
                url: issue.html_url,
                createdAt: issue.created_at,
                labels: issue.labels.map((l: any) => l.name),
                comments: issue.comments
            }))
        };
    }

    // 3. Get Repository Information
    @Tool({
        name: 'get_repository_info',
        description: 'Get metadata about a GitHub repository: stars, forks, license, latest release, etc.',
        inputSchema: z.object({
            repo: z.string().describe('Full repo name (owner/repo)')
        })
    })
    async getRepositoryInfo(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Getting repo info', { repo: input.repo });
        const info = await this.githubService.getRepositoryInfo(input.repo);
        return info;
    }

    // 4. Get Pull Request Details
    @Tool({
        name: 'get_pr_details',
        description: 'Get detailed information about a specific pull request.',
        inputSchema: z.object({
            owner: z.string().describe('Repository owner'),
            repo: z.string().describe('Repository name'),
            prNumber: z.number().describe('PR number')
        })
    })
    async getPRDetails(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Fetching PR details', { repo: input.repo, pr: input.prNumber });
        const data = await this.githubService.getPRDetails(input.owner, input.repo, input.prNumber);
        const pr = data.pr;
        return {
            title: pr.title,
            state: pr.state,
            author: pr.user.login,
            url: pr.html_url,
            summary: pr.body?.slice(0, 500),
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            mergedAt: pr.merged_at,
            additions: pr.additions,
            deletions: pr.deletions,
            changedFiles: pr.changed_files,
            labels: pr.labels.map((l: any) => l.name),
            reviews: data.reviews.map((r: any) => ({
                reviewer: r.user.login,
                state: r.state,
                submittedAt: r.submitted_at
            }))
        };
    }

    // 5. List My Open Pull Requests
    @Tool({
        name: 'get_user_open_prs',
        description: 'Get all open pull requests authored by a GitHub user.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username'),
            limit: z.number().min(1).max(30).default(10).describe('Max PRs')
        })
    })
    async getUserOpenPRs(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Fetching open PRs', { username: input.username });
        const data = await this.githubService.getUserOpenPRs(input.username, input.limit);
        return {
            username: input.username,
            totalOpenPRs: data.total_count,
            prs: data.items.map((pr: any) => ({
                title: pr.title,
                repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
                url: pr.html_url,
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                labels: pr.labels.map((l: any) => l.name)
            }))
        };
    }

    // 6. Contributor Statistics
    @Tool({
        name: 'get_contributor_stats',
        description: 'Get public contribution stats and profile for a GitHub user.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username')
        })
    })
    async getContributorStats(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Fetching contributor stats', { username: input.username });
        const data = await this.githubService.getContributorStats(input.username);
        const user = data.user;
        return {
            username: user.login,
            name: user.name,
            bio: user.bio,
            company: user.company,
            location: user.location,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            totalMergedPRs: data.mergedPRs,
            profileUrl: user.html_url,
            memberSince: user.created_at
        };
    }

    // 7. Repository Health
    @Tool({
        name: 'get_repo_health',
        description: 'Analyze repository health and return a 0-100 score.',
        inputSchema: z.object({
            repo: z.string().describe('Full repo name (owner/repo)')
        })
    })
    async getRepoHealth(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Analyzing repo health', { repo: input.repo });
        const health = await this.githubService.getRepoHealth(input.repo);
        return health;
    }

    // 8. Open Source Recommendation
    @Tool({
        name: 'recommend_repositories',
        description: 'Recommend open source repositories based on user interests.',
        inputSchema: z.object({
            interests: z.array(z.string()).min(1).describe('List of topics, e.g. ["Rust", "AI"]')
        })
    })
    async recommendRepositories(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Recommending repos', { interests: input.interests });
        const recs = await this.githubService.recommendRepositories(input.interests);
        return { count: recs.length, recommendations: recs };
    }

    // 9. Daily Contribution Dashboard
    @Tool({
        name: 'get_daily_dashboard',
        description: 'Get a daily summary of open‑source activity for a user.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username')
        })
    })
    async getDailyDashboard(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Building daily dashboard', { username: input.username });
        const dashboard = await this.githubService.getDailyDashboard(input.username);
        return dashboard;
    }

    // 10. Repository Activity Summary
    @Tool({
        name: 'get_activity_summary',
        description: 'Generate a human-readable activity summary for a repository.',
        inputSchema: z.object({
            repo: z.string().describe('Full repo name (owner/repo)')
        })
    })
    async getActivitySummary(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Building activity summary', { repo: input.repo });
        const summary = await this.githubService.getActivitySummary(input.repo);
        return summary;
    }
}