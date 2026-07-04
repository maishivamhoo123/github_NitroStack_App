var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { FlightTools } from './flights.tools.js';
import { BookingTools } from './booking.tools.js';
import { FlightPrompts } from './flights.prompts.js';
import { FlightResources } from './flights.resources.js';
import { DuffelService } from '../../services/duffel.service.js';
let FlightsModule = class FlightsModule {
};
FlightsModule = __decorate([
    Module({
        name: 'flights',
        description: 'Professional flight search and booking system powered by Duffel API',
        controllers: [FlightTools, BookingTools, FlightPrompts, FlightResources],
        providers: [DuffelService]
    })
], FlightsModule);
export { FlightsModule };
//# sourceMappingURL=flights.module.js.map