var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Duffel } from '@duffel/api';
import { Injectable } from '@nitrostack/core';
/**
 * Duffel API Service
 *
 * Handles all interactions with the Duffel API for flight search and booking.
 * Implements best practices from Duffel documentation.
 */
let DuffelService = class DuffelService {
    duffel;
    constructor() {
        const apiKey = process.env.DUFFEL_API_KEY;
        if (!apiKey) {
            throw new Error('DUFFEL_API_KEY environment variable is required');
        }
        this.duffel = new Duffel({
            token: apiKey
        });
    }
    /**
     * Search for flights using offer requests
     *
     * @param params Search parameters
     * @returns Flight offers
     */
    async searchFlights(params) {
        try {
            const slices = [
                {
                    origin: params.origin,
                    destination: params.destination,
                    departure_date: params.departureDate,
                    ...(params.departureTime && { departure_time: params.departureTime }),
                    ...(params.arrivalTime && { arrival_time: params.arrivalTime })
                }
            ];
            // Add return slice if round trip
            if (params.returnDate) {
                slices.push({
                    origin: params.destination,
                    destination: params.origin,
                    departure_date: params.returnDate
                });
            }
            const offerRequest = await this.duffel.offerRequests.create({
                slices,
                passengers: params.passengers,
                cabin_class: params.cabinClass,
                max_connections: params.maxConnections,
                return_offers: true
            });
            return {
                id: offerRequest.data.id,
                offers: offerRequest.data.offers || [],
                passengers: offerRequest.data.passengers,
                slices: offerRequest.data.slices
            };
        }
        catch (error) {
            throw new Error(`Flight search failed: ${error.message || JSON.stringify(error.errors || error)}`);
        }
    }
    /**
     * Get a specific offer by ID
     */
    async getOffer(offerId) {
        try {
            const offer = await this.duffel.offers.get(offerId);
            return offer.data;
        }
        catch (error) {
            throw new Error(`Failed to get offer: ${error.message}`);
        }
    }
    /**
     * Get available seats for an offer
     */
    async getAvailableSeats(offerId) {
        try {
            const seatMaps = await this.duffel.seatMaps.get({ offer_id: offerId });
            return seatMaps.data;
        }
        catch (error) {
            throw new Error(`Failed to get seat maps: ${error.message}`);
        }
    }
    /**
     * Generate a simple UUID-like identifier
     */
    generateId() {
        return 'pas_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    /**
     * Create an order (book a flight) with optional hold
     * This creates a new offer request with passenger details to get passenger IDs,
     * then uses those IDs to create the order
     */
    async createOrder(params) {
        try {
            // Step 1: Get the offer to extract flight details
            const offer = await this.duffel.offers.get(params.selectedOffers[0]);
            const offerData = offer.data;
            // Step 2: Create a new offer request with passenger details to get passenger IDs
            const offerRequest = await this.duffel.offerRequests.create({
                slices: offerData.slices.map((slice) => ({
                    origin: slice.origin.iata_code,
                    destination: slice.destination.iata_code,
                    departure_date: slice.segments[0].departing_at.split('T')[0]
                })),
                passengers: params.passengers.map(p => ({
                    type: 'adult', // Simplified - you can enhance this based on age
                    given_name: p.given_name,
                    family_name: p.family_name,
                    title: p.title,
                    gender: p.gender.toLowerCase(),
                    born_on: p.born_on,
                    email: p.email,
                    phone_number: p.phone_number
                })),
                cabin_class: offerData.cabin_class || 'economy',
                return_offers: true // We need offers to be returned!
            });
            const passengerIds = offerRequest.data.passengers.map((p) => p.id);
            // Step 3: Create order using passenger IDs from the NEW offer request
            // We need to use an offer from THIS offer request, not the original one
            const newOfferId = offerRequest.data.offers?.[0]?.id;
            if (!newOfferId) {
                throw new Error('No offers returned from offer request with passenger details');
            }
            const orderData = {
                selected_offers: [newOfferId], // Use offer from the NEW request
                passengers: passengerIds.map((id, index) => ({
                    id: id,
                    ...params.passengers[index],
                    gender: params.passengers[index].gender.toLowerCase()
                })),
                type: 'hold' // Always create hold orders
            };
            const order = await this.duffel.orders.create(orderData);
            return order.data;
        }
        catch (error) {
            // Log detailed error information
            const errorDetails = {
                message: error.message,
                errors: error.errors,
                response: error.response?.data,
                status: error.response?.status
            };
            console.error('Duffel order creation failed:', JSON.stringify(errorDetails, null, 2));
            throw new Error(`Failed to create order: ${error.message || JSON.stringify(error.errors || error.response?.data || error)}`);
        }
    }
    /**
     * Get available seats for an offer
     */
    async getSeatsForOffer(offerId) {
        try {
            const seatMaps = await this.duffel.seatMaps.get({ offer_id: offerId });
            return seatMaps.data;
        }
        catch (error) {
            throw new Error(`Failed to get seats: ${error.message || JSON.stringify(error.errors || error)}`);
        }
    }
    /**
     * Create order change request for seats
     */
    async createOrderChangeForSeats(orderId) {
        try {
            const changeRequest = await this.duffel.orderChangeRequests.create({
                order_id: orderId
            });
            return changeRequest.data;
        }
        catch (error) {
            throw new Error(`Failed to create order change: ${error.message || JSON.stringify(error.errors || error)}`);
        }
    }
    /**
     * Get available services (baggage, seats) for an order
     */
    async getAvailableServices(orderId) {
        try {
            const services = await this.duffel.orderChangeRequests.create({
                order_id: orderId
            });
            return services.data;
        }
        catch (error) {
            throw new Error(`Failed to get available services: ${error.message || JSON.stringify(error.errors || error)}`);
        }
    }
    /**
     * Get order details
     */
    async getOrder(orderId) {
        try {
            const order = await this.duffel.orders.get(orderId);
            return order.data;
        }
        catch (error) {
            throw new Error(`Failed to get order: ${error.message}`);
        }
    }
    /**
     * Cancel an order
     */
    async cancelOrder(orderId) {
        try {
            const cancellation = await this.duffel.orderCancellations.create({
                order_id: orderId
            });
            return cancellation.data;
        }
        catch (error) {
            throw new Error(`Failed to cancel order: ${error.message}`);
        }
    }
    /**
     * Search for airports by query
     */
    async searchAirports(query) {
        try {
            const suggestions = await this.duffel.suggestions.list({
                query: query
            });
            return suggestions.data;
        }
        catch (error) {
            throw new Error(`Failed to search airports: ${error.message}`);
        }
    }
    /**
     * Get airlines list
     */
    async getAirlines() {
        try {
            const airlines = await this.duffel.airlines.list();
            return airlines.data;
        }
        catch (error) {
            throw new Error(`Failed to get airlines: ${error.message}`);
        }
    }
};
DuffelService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], DuffelService);
export { DuffelService };
//# sourceMappingURL=duffel.service.js.map