import { ExecutionContext } from '@nitrostack/core';
import { DuffelService } from '../../services/duffel.service.js';
export declare class BookingTools {
    private duffelService;
    constructor(duffelService: DuffelService);
    createOrder(input: any, ctx: ExecutionContext): Promise<{
        orderId: string;
        status: string;
        totalAmount: string;
        totalCurrency: string;
        expiresAt: any;
        bookingReference: string;
        passengers: {
            id: any;
            name: string;
            type: any;
        }[];
        slices: {
            origin: any;
            destination: any;
            departureTime: any;
            arrivalTime: any;
        }[];
        message: string;
    }>;
    getOrderDetails(input: any, ctx: ExecutionContext): Promise<{
        orderId: string;
        status: any;
        bookingReference: string;
        totalAmount: string;
        totalCurrency: string;
        createdAt: string;
        expiresAt: any;
        passengers: {
            id: any;
            name: string;
            type: any;
            email: any;
            phoneNumber: any;
        }[];
        slices: {
            id: any;
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
    }>;
    getSeatMap(input: any, ctx: ExecutionContext): Promise<{
        offerId: any;
        cabins: {
            cabinClass: any;
            rows: any;
        }[];
        message: string;
    }>;
    cancelOrder(input: any, ctx: ExecutionContext): Promise<{
        orderId: any;
        cancellationId: string;
        status: string;
        refundAmount: string | null;
        refundCurrency: string | null;
        confirmedAt: string;
        message: string;
    }>;
}
//# sourceMappingURL=booking.tools.d.ts.map