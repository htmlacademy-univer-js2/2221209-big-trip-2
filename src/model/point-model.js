import {points} from '../mocks/points.js';
import {destinations} from '../mocks/destinations.js';
import {offersByType} from '../mocks/offers.js';

class PointModel {
  #points = null
  #destinations = null
  #offersByType = null

  constructor() {
    this.#points = points;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}

export {PointModel};
