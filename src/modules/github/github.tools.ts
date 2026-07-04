import { ToolDecorator as Tool, ExecutionContext, z, Injectable } from '@nitrostack/core';
import { GitHubService } from '../../services/github.service.js';

@Injectable({ deps: [GitHubService] })
export class GitHubTools {
    constructor(private githubService: GitHubService) { }

    @Tool({
        name: 'get_user_open_prs',
        description: 'Get all open pull requests authored by a GitHub user across public repositories.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username to look up'),
            limit: z.number().min(1).max(30).default(10).describe('Number of PRs to return')
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

    @Tool({
        name: 'get_pr_details',
        description: 'Get detailed information about a specific pull request including review status, files changed, and comments.',
        inputSchema: z.object({
            owner: z.string().describe('Repository owner username or organization'),
            repo: z.string().describe('Repository name'),
            prNumber: z.number().describe('Pull request number')
        })
    })
    async getPRDetails(input: any, ctx: ExecutionContext) {
        ctx.logger.info('Fetching PR details', { repo: input.repo, prNumber: input.prNumber });
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

    @Tool({
        name: 'find_good_first_issues',
        description: 'Find open issues labeled "good first issue" in a GitHub repository. Useful for discovering beginner-friendly open source contributions.',
        inputSchema: z.object({
            repo: z.string().describe('Repository in owner/repo format, e.g. kubernetes/kubernetes'),
            limit: z.number().min(1).max(20).default(10).describe('Number of issues to return')
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

    @Tool({
        name: 'get_contributor_stats',
        description: 'Get public contribution stats for a GitHub user including their profile, public repos, followers, and total merged pull requests.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username to look up')
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
}