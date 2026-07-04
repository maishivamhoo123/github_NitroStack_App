var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z, Injectable } from '@nitrostack/core';
import { GitHubService } from '../../services/github.service.js';
let GitHubTools = class GitHubTools {
    githubService;
    constructor(githubService) {
        this.githubService = githubService;
    }
    async getUserOpenPRs(input, ctx) {
        ctx.logger.info('Fetching open PRs', { username: input.username });
        const data = await this.githubService.getUserOpenPRs(input.username, input.limit);
        return {
            username: input.username,
            totalOpenPRs: data.total_count,
            prs: data.items.map((pr) => ({
                title: pr.title,
                repo: pr.repository_url.replace('https://api.github.com/repos/', ''),
                url: pr.html_url,
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                labels: pr.labels.map((l) => l.name)
            }))
        };
    }
    async getPRDetails(input, ctx) {
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
            labels: pr.labels.map((l) => l.name),
            reviews: data.reviews.map((r) => ({
                reviewer: r.user.login,
                state: r.state,
                submittedAt: r.submitted_at
            }))
        };
    }
    async findGoodFirstIssues(input, ctx) {
        ctx.logger.info('Finding good first issues', { repo: input.repo });
        const issues = await this.githubService.findGoodFirstIssues(input.repo, input.limit);
        return {
            repo: input.repo,
            count: issues.length,
            issues: issues.map((issue) => ({
                title: issue.title,
                number: issue.number,
                url: issue.html_url,
                createdAt: issue.created_at,
                labels: issue.labels.map((l) => l.name),
                comments: issue.comments
            }))
        };
    }
    async getContributorStats(input, ctx) {
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
};
__decorate([
    Tool({
        name: 'get_user_open_prs',
        description: 'Get all open pull requests authored by a GitHub user across public repositories.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username to look up'),
            limit: z.number().min(1).max(30).default(10).describe('Number of PRs to return')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GitHubTools.prototype, "getUserOpenPRs", null);
__decorate([
    Tool({
        name: 'get_pr_details',
        description: 'Get detailed information about a specific pull request including review status, files changed, and comments.',
        inputSchema: z.object({
            owner: z.string().describe('Repository owner username or organization'),
            repo: z.string().describe('Repository name'),
            prNumber: z.number().describe('Pull request number')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GitHubTools.prototype, "getPRDetails", null);
__decorate([
    Tool({
        name: 'find_good_first_issues',
        description: 'Find open issues labeled "good first issue" in a GitHub repository. Useful for discovering beginner-friendly open source contributions.',
        inputSchema: z.object({
            repo: z.string().describe('Repository in owner/repo format, e.g. kubernetes/kubernetes'),
            limit: z.number().min(1).max(20).default(10).describe('Number of issues to return')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GitHubTools.prototype, "findGoodFirstIssues", null);
__decorate([
    Tool({
        name: 'get_contributor_stats',
        description: 'Get public contribution stats for a GitHub user including their profile, public repos, followers, and total merged pull requests.',
        inputSchema: z.object({
            username: z.string().describe('GitHub username to look up')
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GitHubTools.prototype, "getContributorStats", null);
GitHubTools = __decorate([
    Injectable({ deps: [GitHubService] }),
    __metadata("design:paramtypes", [GitHubService])
], GitHubTools);
export { GitHubTools };
//# sourceMappingURL=github.tools.js.map