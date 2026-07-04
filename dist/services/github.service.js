var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import axios from 'axios';
let GitHubService = class GitHubService {
    baseUrl = 'https://api.github.com';
    headers;
    constructor() {
        this.headers = {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }
    async getUserOpenPRs(username, limit = 10) {
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
    async getPRDetails(owner, repo, prNumber) {
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
    async findGoodFirstIssues(repo, limit = 10) {
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
    async getContributorStats(username) {
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
};
GitHubService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], GitHubService);
export { GitHubService };
//# sourceMappingURL=github.service.js.map