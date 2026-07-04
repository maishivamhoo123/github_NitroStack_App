import { ExecutionContext } from '@nitrostack/core';
import { DuffelService } from '../../services/duffel.service.js';
export declare class FlightPrompts {
    private duffelService;
    constructor(duffelService: DuffelService);
    flightSearchAssistant(input: any, ctx: ExecutionContext): Promise<{
        role: string;
        content: string;
    }>;
    flightComparison(input: any, ctx: ExecutionContext): Promise<{
        role: string;
        content: string;
    }>;
    travelTips(input: any, ctx: ExecutionContext): Promise<{
        role: string;
        content: string;
    }>;
    bookingAssistant(input: any, ctx: ExecutionContext): Promise<{
        role: string;
        content: string;
    }>;
}
//# sourceMappingURL=flights.prompts.d.ts.map