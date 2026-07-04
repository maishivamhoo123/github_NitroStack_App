#!/usr/bin/env node
/**
 * Calculator MCP Server with OAuth 2.1 Authentication
 *
 * Main entry point for the MCP server.
 * Uses the @McpApp decorator pattern for clean, NestJS-style architecture.
 *
 * OAuth 2.1 Compliance:
 * - MCP Specification: https://modelcontextprotocol.io/specification/draft/basic/authorization
 * - OpenAI Apps SDK: https://developers.openai.com/apps-sdk/build/auth
 * - RFC 9728 - Protected Resource Metadata
 * - RFC 8707 - Resource Indicators (Token Audience Binding)
 *
 * Transport Configuration:
 * - Development (NODE_ENV=development): STDIO only
 * - Production (NODE_ENV=production): Dual transport (STDIO + HTTP SSE)
 * - With OAuth: Dual mode (STDIO + HTTP for metadata endpoints)
 */
import 'dotenv/config';
//# sourceMappingURL=index.d.ts.map