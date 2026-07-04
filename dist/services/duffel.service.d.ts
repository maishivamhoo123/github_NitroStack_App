/**
 * Duffel API Service
 *
 * Handles all interactions with the Duffel API for flight search and booking.
 * Implements best practices from Duffel documentation.
 */
export declare class DuffelService {
    private duffel;
    constructor();
    /**
     * Search for flights using offer requests
     *
     * @param params Search parameters
     * @returns Flight offers
     */
    searchFlights(params: {
        origin: string;
        destination: string;
        departureDate: string;
        returnDate?: string;
        passengers: Array<{
            type: 'adult';
        } | {
            type: 'child';
            age: number;
        } | {
            type: 'infant_without_seat';
        }>;
        cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
        maxConnections?: number;
        departureTime?: {
            from: string;
            to: string;
        };
        arrivalTime?: {
            from: string;
            to: string;
        };
    }): Promise<{
        id: string;
        offers: Omit<import("@duffel/api/booking/Offers/OfferTypes").Offer, "available_services">[];
        passengers: import("@duffel/api/booking/OfferRequests/OfferRequestsTypes").OfferRequestPassenger[];
        slices: import("@duffel/api/booking/OfferRequests/OfferRequestsTypes").OfferRequestSlice[];
    }>;
    /**
     * Get a specific offer by ID
     */
    getOffer(offerId: string): Promise<import("@duffel/api/booking/Offers/OfferTypes").Offer>;
    /**
     * Get available seats for an offer
     */
    getAvailableSeats(offerId: string): Promise<import("@duffel/api/booking/SeatMaps/SeatMapTypes").SeatMap[]>;
    /**
     * Generate a simple UUID-like identifier
     */
    private generateId;
    /**
     * Create an order (book a flight) with optional hold
     * This creates a new offer request with passenger details to get passenger IDs,
     * then uses those IDs to create the order
     */
    createOrder(params: {
        selectedOffers: string[];
        passengers: Array<{
            title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
            given_name: string;
            family_name: string;
            gender: 'M' | 'F';
            born_on: string;
            email: string;
            phone_number: string;
        }>;
    }): Promise<import("@duffel/api/booking/Orders/OrdersTypes").Order>;
    /**
     * Get available seats for an offer
     */
    getSeatsForOffer(offerId: string): Promise<import("@duffel/api/booking/SeatMaps/SeatMapTypes").SeatMap[]>;
    /**
     * Create order change request for seats
     */
    createOrderChangeForSeats(orderId: string): Promise<import("@duffel/api/booking/OrderChangeRequests/OrderChangeRequestsTypes").OrderChangeRequestResponse>;
    /**
     * Get available services (baggage, seats) for an order
     */
    getAvailableServices(orderId: string): Promise<import("@duffel/api/booking/OrderChangeRequests/OrderChangeRequestsTypes").OrderChangeRequestResponse>;
    /**
     * Get order details
     */
    getOrder(orderId: string): Promise<import("@duffel/api/booking/Orders/OrdersTypes").Order>;
    /**
     * Cancel an order
     */
    cancelOrder(orderId: string): Promise<import("@duffel/api/booking/OrderCancellations/OrderCancellationsTypes").OrderCancellation>;
    /**
     * Search for airports by query
     */
    searchAirports(query: string): Promise<import("@duffel/api/Places/Suggestions/SuggestionsType").Places[]>;
    /**
     * Get airlines list
     */
    getAirlines(): Promise<import("@duffel/api/supportingResources/Airlines/AirlinesTypes").Airline[]>;
}
//# sourceMappingURL=duffel.service.d.ts.map