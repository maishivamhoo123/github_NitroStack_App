export declare class GitHubService {
    private readonly baseUrl;
    private readonly headers;
    constructor();
    getUserOpenPRs(username: string, limit?: number): Promise<any>;
    getPRDetails(owner: string, repo: string, prNumber: number): Promise<{
        pr: any;
        reviews: any;
    }>;
    findGoodFirstIssues(repo: string, limit?: number): Promise<any>;
    getContributorStats(username: string): Promise<{
        user: any;
        mergedPRs: any;
    }>;
}
//# sourceMappingURL=github.service.d.ts.map