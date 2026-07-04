# GitHub Open Source Assistant MCP

**A NitroStack-powered MCP server that helps open-source contributors discover repositories, find beginner-friendly issues, assess project health, and get personalized insights — all through their AI assistant.**

[![NitroStack](https://img.shields.io/badge/Built%20with-NitroStack-6366f1?style=flat-square)](https://nitrostack.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 📖 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Locally](#-running-locally)
- [Connecting from NitroStack Studio](#-connecting-from-nitrostack-studio)
- [Available MCP Tools](#-available-mcp-tools)
  - [1. Search Repositories](#1-search-repositories)
  - [2. Find Good First Issues](#2-find-good-first-issues)
  - [3. Get Repository Information](#3-get-repository-information)
  - [4. Get Pull Request Details](#4-get-pull-request-details)
  - [5. List My Open Pull Requests](#5-list-my-open-pull-requests)
  - [6. Contributor Statistics](#6-contributor-statistics)
  - [7. Repository Health](#7-repository-health)
  - [8. Open Source Recommendation](#8-open-source-recommendation)
  - [9. Daily Contribution Dashboard](#9-daily-contribution-dashboard)
  - [10. Repository Activity Summary](#10-repository-activity-summary)
- [Example Tool Calls](#-example-tool-calls)
- [Project Architecture](#-project-architecture)
- [Error Handling & Rate Limits](#-error-handling--rate-limits)
- [Contributing](#-contributing)
- [License](#-license)
- [Links & Community](#-links--community)

---

## 🚀 Features

- 🔍 **Search Repositories** – Find open-source projects by keyword, language, and minimum stars.
- 🏷️ **Find Good First Issues** – Discover issues labelled **`good first issue`** or **`help wanted`** in any repo.
- 📊 **Repository Insights** – Get stars, forks, open issues, default branch, license, and latest release.
- 🔀 **Pull Request Details** – View title, author, state, changed files, additions/deletions, review status, and reviewers.
- 📝 **My Open Pull Requests** – List all open PRs for a user, sorted by recent activity.
- 👤 **Contributor Statistics** – See merged PR count, followers, public repos, organizations, and a contribution summary.
- ❤️ **Repository Health Score** – Evaluate repo health (0–100) based on stale issues/PRs, CI status, documentation, maintainers, etc.
- 🧭 **Open Source Recommendations** – Get tailored repository suggestions based on your interests (e.g., Rust, AI, Web3) with reasons.
- 📅 **Daily Contribution Dashboard** – Snapshot of active PRs, pending reviews, assigned issues, recent merges, and repos needing attention.
- 📈 **Repository Activity Summary** – Human-readable summary of recent commits, releases, issues, pull requests, and top contributors.

All tools are implemented using **NitroStack** decorators, fully typed, and follow production best practices.

---

## 🛠 Prerequisites

- **Node.js** 18.x or 20.x (LTS recommended)
- **npm** 8.x or newer
- A **GitHub Personal Access Token (classic)** with the following scopes:
  - `public_repo` (required for accessing public repositories)
  - `repo` (optional, for private repos)
  - `read:user` (for user profile data)

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/maishivamhoo123/github_NitroStack_App.git
cd github_NitroStack_App

# Install dependencies
npm install
```

---

## ⚙️ Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and set your GitHub token:
   ```env
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   > ⚠️ **Important:** The `.env` file is already listed in `.gitignore`. Never commit it to version control.

---

## 🏃 Running Locally

Start the development server with hot‑reload:

```bash
npm run dev
```

Expected output:
```
✓ Development Server Ready
MCP Server  Running (STDIO transport)
```

The MCP server communicates via **STDIO**, making it compatible with clients like Claude Desktop, Cursor, and NitroStack Studio.

To build and run the production version:

```bash
npm run build
npm start
```

---

## 🧩 Connecting from NitroStack Studio

1. Download and open **NitroStack Studio** from [nitrostack.ai/studio](https://nitrostack.ai/studio).
2. In Studio, go to **Projects** → **Open Project**.
3. Navigate to your project folder (`github_NitroStack_App`).
4. If the dev server is already running, Studio will automatically connect. You can then use the **Testing Tools** to call individual tools, or the **Chat Interface** to interact with the assistant via natural language.

---

## 🧰 Available MCP Tools

Below is a detailed description of every tool exposed by the server.

### 1. Search Repositories
Searches GitHub for repositories matching a keyword.

**Inputs:**

| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| keyword   | string | Yes      | Search query (e.g., "machine learning")        |
| language  | string | No       | Filter by programming language (e.g., Python)  |
| stars     | number | No       | Minimum number of stars                        |
| limit     | number | No       | Maximum results (default: 10, max: 100)        |

**Output:** Array of objects with `name`, `full_name`, `stars`, `language`, `description`, `url`.

---

### 2. Find Good First Issues
Lists open issues labelled `good first issue` or `help wanted` in a specific repository.

**Inputs:**

| Parameter  | Type   | Required | Description                |
|------------|--------|----------|----------------------------|
| owner/repo | string | Yes      | Full repository name (e.g. `facebook/react`) |

**Output:** Array of issues containing `title`, `url`, `labels` (array of strings), `created_at`.

---

### 3. Get Repository Information
Retrieves key metadata about a repository.

**Inputs:**

| Parameter  | Type   | Required | Description                |
|------------|--------|----------|----------------------------|
| owner/repo | string | Yes      | Full repository name       |

**Output:** Object with `stars`, `forks`, `open_issues`, `default_branch`, `description`, `latest_release`, `license`.

---

### 4. Get Pull Request Details
Fetches detailed information about a specific pull request.

**Inputs:**

| Parameter | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| owner     | string | Yes      | Repository owner    |
| repo      | string | Yes      | Repository name     |
| pr_number | number | Yes      | Pull request number |

**Output:** Object containing `title`, `author`, `state`, `changed_files`, `additions`, `deletions`, `review_status`, `mergeable` (boolean or null), `reviewers` (array of usernames).

---

### 5. List My Open Pull Requests
Lists all open pull requests across GitHub for a given user.

**Inputs:**

| Parameter | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| username  | string | Yes      | GitHub username     |

**Output:** Array of open PR objects (sorted by `updated_at` descending) with basic details.

---

### 6. Contributor Statistics
Gathers overall contribution statistics for a GitHub user.

**Inputs:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| username  | string | Yes      | GitHub username |

**Output:** Object with `merged_pr_count`, `followers`, `public_repos`, `organizations` (array), `contribution_summary` (human‑readable text).

---

### 7. Repository Health
Analyzes a repository's health and returns a numeric score along with detailed metrics.

**Inputs:**

| Parameter  | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| owner/repo | string | Yes      | Full repository name |

**Output:** Object containing:

| Field                               | Type    | Description                                        |
|-------------------------------------|---------|----------------------------------------------------|
| health_score                        | number  | Overall score from 0 (poor) to 100 (excellent)     |
| stale_issues_count                  | number  | Issues with no activity for 30+ days               |
| stale_prs_count                     | number  | PRs with no activity for 30+ days                  |
| average_issue_response_time_hours   | number  | Average time before first response on issues       |
| has_documentation                   | boolean | Whether the repo has a README or wiki              |
| maintainers_count                   | number  | Approximate number of active maintainers           |
| ci_status                           | string  | Status of CI checks (e.g., "passing", "failing")   |
| license                             | string  | License name (e.g., MIT) or null                   |
| release_frequency                   | string  | Description (e.g., "weekly", "monthly", "rarely")  |

---

### 8. Open Source Recommendation
Recommends repositories that match a set of user‑provided interests.

**Inputs:**

| Parameter | Type     | Required | Description                              |
|-----------|----------|----------|------------------------------------------|
| interests | string[] | Yes      | List of topics (e.g., `["Rust", "AI"]`)  |

**Output:** Array of recommended repositories, each with `name`, `full_name`, `description`, `stars`, and `why` (an explanation of the recommendation).

---

### 9. Daily Contribution Dashboard
Provides a snapshot of today's open‑source activity for a user.

**Inputs:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| username  | string | Yes      | GitHub username |

**Output:** Object containing:

| Field                          | Type     | Description                                   |
|--------------------------------|----------|-----------------------------------------------|
| active_prs                     | array    | Open pull requests (title, url, repo)         |
| pending_reviews                | array    | PRs awaiting review from the user             |
| assigned_issues                | array    | Issues assigned to the user                   |
| recent_merged_prs              | array    | Recently merged PRs                           |
| repositories_needing_attention | string[] | Repos with stale issues/PRs or failing CI     |

---

### 10. Repository Activity Summary
Generates a human‑readable summary of recent activity in a repository.

**Inputs:**

| Parameter  | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| owner/repo | string | Yes      | Full repository name |

**Output:** Object containing:

| Field                | Type     | Description                               |
|----------------------|----------|-------------------------------------------|
| recent_commits       | string[] | Messages of the latest commits            |
| recent_releases      | string[] | Names/tags of recent releases             |
| newest_issues        | string[] | Titles of the most recently opened issues |
| newest_pull_requests | string[] | Titles of the newest PRs                  |
| top_contributors     | string[] | Usernames of top recent contributors      |

---

## 📝 Example Tool Calls

### Via NitroStack Studio (AI Chat)

> **User:** "Find good first issues for kubernetes/kubernetes"  
> **Assistant:** Returns a list of issues with labels `good first issue` and `help wanted`, including direct links.

---

### Manual JSON‑RPC Request

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_repositories",
    "arguments": {
      "keyword": "react",
      "language": "TypeScript",
      "stars": 1000,
      "limit": 5
    }
  },
  "id": 1
}
```

---

### Inside Claude Desktop

If configured as an MCP server, you can ask:

> "Show me the health score of the facebook/react repository"

---

## 🏗️ Project Architecture

```
src/
├── index.ts                        # Entry point – initializes and starts the MCP server
├── app.module.ts                   # Root module, imports all feature modules
├── modules/
│   └── github/
│       ├── github.module.ts        # GitHub feature module – registers service & tools
│       └── github.tools.ts         # Tool definitions using NitroStack @Tool() decorators
├── services/
│   └── github/
│       └── github.service.ts       # GitHub API communication layer (axios)
└── types/
    └── github.types.ts             # TypeScript interfaces for all data structures
```

### Design Principles

- **Modularity** – The GitHub feature is self‑contained; adding other Git platforms only requires a new module.
- **Separation of Concerns** – API logic lives exclusively in the service layer, tool classes handle validation and response formatting.
- **Dependency Injection** – Services are injected into tool classes via NitroStack’s DI container.
- **Strong Typing** – Every input and output is defined with TypeScript interfaces, ensuring compiler‑assisted correctness.
- **Input Validation** – Tool parameters are validated using Zod schemas provided through NitroStack decorators.
- **Rate Limit Awareness** – The service layer monitors GitHub rate‑limit headers and returns friendly error messages when limits are reached.

---

## ⚠️ Error Handling & Rate Limits

- **Authentication** – All requests to the GitHub API are authenticated with a personal access token. Unauthenticated requests are capped at **60 requests/hour**; with a token you get **5,000 requests/hour**.
- **Rate Limit Detection** – The service checks response headers `x-ratelimit-remaining` and `x-ratelimit-reset`. If the limit is exceeded, the tool returns a clear error message indicating when the limit will reset.
- **Consistent Response Format**  
  Success:
  ```json
  { "success": true, "data": { ... } }
  ```
  Failure:
  ```json
  { "success": false, "error": "Detailed error message", "statusCode": 403 }
  ```
- **Network & API Errors** – All axios exceptions are caught and translated into user‑friendly messages.

---

## 🤝 Contributing

Contributions are welcome! If you’d like to add new tools, improve error handling, or extend the server to other platforms (GitLab, Bitbucket), please:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

Please follow the existing code style, add TypeScript types for any new data structures, and write Zod schemas for tool inputs.

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links & Community

- **NitroStack Documentation** – [https://docs.nitrostack.ai](https://docs.nitrostack.ai)
- **OAuth 2.1 Guide** – [https://docs.nitrostack.ai/sdk/typescript/11-oauth-authentication](https://docs.nitrostack.ai/sdk/typescript/11-oauth-authentication)
- **NitroStack Studio** – [https://nitrostack.ai/studio](https://nitrostack.ai/studio)
- **GitHub Organization** – [https://github.com/nitrostackai](https://github.com/nitrostackai)

**Community:**
- Discord: [https://discord.gg/uVWey6UhuD](https://discord.gg/uVWey6UhuD)
- X (Twitter): [@nitrostackai](https://x.com/nitrostackai)
- YouTube: [@nitrostackai](https://www.youtube.com/@nitrostackai)
- LinkedIn: [NitroStack AI](https://linkedin.com/company/nitrostack-ai/)

---