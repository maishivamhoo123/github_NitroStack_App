import { Guard, ExecutionContext } from '@nitrostack/core';
/**
 * OAuth Guard
 *
 * Validates OAuth 2.1 access tokens according to MCP specification.
 *
 * Performs:
 * - Token validation (introspection or JWT validation)
 * - Audience binding (RFC 8707) - CRITICAL for security
 * - Scope validation
 * - Expiration checking
 *
 * Compatible with:
 * - OpenAI Apps SDK
 * - Any RFC-compliant OAuth 2.1 provider
 *
 * Usage:
 * ```typescript
 * @Tool({
 *   name: 'protected_resource',
 *   description: 'A protected tool'
 * })
 * @UseGuards(OAuthGuard)
 * async protectedTool() {
 *   // Only accessible with valid OAuth token
 * }
 * ```
 */
export declare class OAuthGuard implements Guard {
    canActivate(context: ExecutionContext): Promise<boolean>;
    /**
     * Extract scopes from token payload
     * Handles both "scope" (space-separated string) and "scopes" (array) formats
     */
    private extractScopes;
}
/**
 * Scope Guard
 *
 * Validates that the OAuth token has required scopes.
 * Use this in addition to OAuthGuard for fine-grained access control.
 *
 * Usage:
 * ```typescript
 * @Tool({ name: 'admin_action' })
 * @UseGuards(OAuthGuard, createScopeGuard(['admin', 'write']))
 * async adminAction() {
 *   // Requires OAuth token with 'admin' AND 'write' scopes
 * }
 * ```
 */
export declare function createScopeGuard(requiredScopes: string[]): new () => Guard;
//# sourceMappingURL=oauth.guard.d.ts.map