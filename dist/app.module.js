var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { McpApp, Module, ConfigModule, OAuthModule } from '@nitrostack/core';
import { GitHubModule } from './modules/github/github.module.js';
import { SystemHealthCheck } from './health/system.health.js';
/**
 * Root Application Module
 *
 * This is the main module that bootstraps the MCP server.
 * It registers all feature modules and health checks.
 *
 * OAuth 2.1 Authentication:
 * - Configured with Auth0 as the authorization server
 * - Supports read, write, and admin scopes
 * - Validates tokens with audience binding (RFC 8707)
 *
 * Flight Booking System:
 * - Powered by Duffel API
 * - Professional flight search and booking capabilities
 * - Comprehensive widgets for search results and flight details
 */
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'airline-ticketing-server',
            version: '1.0.0'
        },
        logging: {
            level: 'info'
        }
    }),
    Module({
        name: 'app',
        description: 'Airline ticketing MCP server with OAuth 2.1 authentication and Duffel integration',
        imports: [
            ConfigModule.forRoot(),
            // Enable OAuth 2.1 authentication
            OAuthModule.forRoot({
                // Resource URI - YOUR MCP server's public URL
                // This is used for token audience binding (RFC 8707)
                // CRITICAL: Tokens must be issued specifically for this URI
                resourceUri: process.env.RESOURCE_URI || 'https://mcplocal',
                // Authorization Server(s) - The OAuth provider URL(s)
                // Supports multiple auth servers for federation scenarios
                authorizationServers: [
                    process.env.AUTH_SERVER_URL || 'https://dev-5dt0utuk31h13tjm.us.auth0.com',
                ],
                // Supported scopes for this MCP server
                // Define what permissions your server supports
                scopesSupported: [
                    'read', // Read access to resources
                    'write', // Write/modify resources
                    'admin', // Administrative operations
                ],
                // Token Introspection (RFC 7662) - For opaque tokens
                // If your OAuth provider issues opaque tokens (not JWTs),
                // you MUST configure introspection to validate them
                tokenIntrospectionEndpoint: process.env.INTROSPECTION_ENDPOINT,
                tokenIntrospectionClientId: process.env.INTROSPECTION_CLIENT_ID,
                tokenIntrospectionClientSecret: process.env.INTROSPECTION_CLIENT_SECRET,
                // Expected audience (defaults to resourceUri if not provided)
                // MUST match the audience claim in tokens (RFC 8707)
                audience: process.env.TOKEN_AUDIENCE,
                // Expected issuer (optional but recommended)
                // If provided, tokens must be from this issuer
                issuer: process.env.TOKEN_ISSUER,
                // Custom validation (optional)
                // Add any additional validation logic beyond spec requirements
                customValidation: async (tokenPayload) => {
                    // Example: Check if user is active in your database
                    // const user = await db.users.findOne({ id: tokenPayload.sub });
                    // return user?.active === true;
                    // For now, accept all valid tokens
                    return true;
                },
            }),
            GitHubModule
        ],
        providers: [
            // Health Checks
            SystemHealthCheck,
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map