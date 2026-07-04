import { ExecutionContext } from '@nitrostack/core';
import { DuffelService } from '../../services/duffel.service.js';
export declare class FlightResources {
    private duffelService;
    constructor(duffelService: DuffelService);
    getSearchHistory(ctx: ExecutionContext): Promise<{
        searches: never[];
        message: string;
    }>;
    getPopularRoutes(ctx: ExecutionContext): Promise<{
        routes: {
            route: string;
            description: string;
            averageDuration: string;
            typicalPrice: string;
            airlines: string[];
        }[];
        note: string;
    }>;
    getBookingGuide(ctx: ExecutionContext): Promise<string>;
    getAirlineCodes(ctx: ExecutionContext): Promise<{
        airlines: {
            iataCode: any;
            name: any;
        }[];
        note: string;
    }>;
}
//# sourceMappingURL=flights.resources.d.ts.map