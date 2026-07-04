import { ExecutionContext } from '@nitrostack/core';
import { GitHubService } from '../../services/github.service.js';
export declare class GitHubTools {
    private githubService;
    constructor(githubService: GitHubService);
    getUserOpenPRs(input: any, ctx: ExecutionContext): Promise<{
        username: any;
        totalOpenPRs: any;
        prs: any;
    }>;
    getPRDetails(input: any, ctx: ExecutionContext): Promise<{
        title: any;
        state: any;
        author: any;
        url: any;
        summary: any;
        createdAt: any;
        updatedAt: any;
        mergedAt: any;
        additions: any;
        deletions: any;
        changedFiles: any;
        labels: any;
        reviews: any;
    }>;
    findGoodFirstIssues(input: any, ctx: ExecutionContext): Promise<{
        repo: any;
        count: any;
        issues: any;
    }>;
    getContributorStats(input: any, ctx: ExecutionContext): Promise<{
        username: any;
        name: any;
        bio: any;
        company: any;
        location: any;
        publicRepos: any;
        followers: any;
        following: any;
        totalMergedPRs: any;
        profileUrl: any;
        memberSince: any;
    }>;
}
//# sourceMappingURL=github.tools.d.ts.map