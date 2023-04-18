import {points} from '../mocks/points.js';
import {destinations} from '../mocks/destinations.js';
import {offersByType} from '../mocks/offers.js';

class PointModel {
  constructor() {
    this.points = points;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }
}

export {PointModel};
