import { Module } from '@nitrostack/core';
import { GitHubTools } from './github.tools.js';
import { GitHubService } from '../../services/github.service.js';

@Module({
    name: 'github',
    description: 'GitHub open source contributor tools — search PRs, issues, and contributor stats',
    controllers: [GitHubTools],
    providers: [GitHubService]
})
export class GitHubModule { }