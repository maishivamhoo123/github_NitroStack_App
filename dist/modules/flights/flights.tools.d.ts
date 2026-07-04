import { ExecutionContext } from '@nitrostack/core';
import { DuffelService } from '../../services/duffel.service.js';
export declare class FlightTools {
    private duffelService;
    constructor(duffelService: DuffelService);
    searchFlights(input: any, ctx: ExecutionContext): Promise<{
        requestId: string;
        searchParams: {
            origin: any;
            destination: any;
            departureDate: any;
            returnDate: any;
            passengers: {
                adults: any;
                children: any;
                infants: any;
            };
            cabinClass: any;
        };
        totalOffers: number;
        offers: any[];
        message: string;
    }>;
    getFlightDetails(input: any, ctx: ExecutionContext): Promise<{
        id: string;
        totalAmount: string;
        totalCurrency: string;
        expiresAt: string;
        slices: {
            origin: {
                code: any;
                name: any;
                city: any;
            };
            destination: {
                code: any;
                name: any;
                city: any;
            };
            duration: any;
            segments: any;
        }[];
        passengers: {
            id: any;
            type: any;
            fareType: any;
            baggageAllowance: any;
        }[];
        conditions: {
            refundBeforeDeparture: {
                allowed: boolean;
                penaltyAmount: string | null | undefined;
                penaltyCurrency: string | null | undefined;
            };
            changeBeforeDeparture: {
                allowed: boolean;
                penaltyAmount: string | null | undefined;
                penaltyCurrency: string | null | undefined;
            };
        };
        paymentRequirements: {
            requiresInstantPayment: boolean;
            priceGuaranteeExpiresAt: string | null;
            paymentRequiredBy: string | null;
        };
    }>;
    searchAirports(input: any, ctx: ExecutionContext): Promise<{
        query: any;
        results: {
            id: any;
            name: any;
            iataCode: any;
            icaoCode: any;
            cityName: any;
            type: any;
            latitude: any;
            longitude: any;
            timeZone: any;
        }[];
    }>;
}
//# sourceMappingURL=flights.tools.d.ts.map