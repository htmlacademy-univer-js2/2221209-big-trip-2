import {points} from '../mocks/points.js';
import {destinations} from '../mocks/destinations.js';
import {offersByType} from '../mocks/offers.js';
import Observable from '../framework/observable.js';

class PointModel extends Observable{
  #points = [];
  #destinations = [];
  #offersByType = [];

  constructor() {
    super();
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

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    this.#points = [
      ...this.points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    this.#points = [
      ...this.points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

}

export {PointModel};
