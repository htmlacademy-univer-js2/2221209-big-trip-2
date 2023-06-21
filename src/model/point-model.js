import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

class PointModel extends Observable{
  #points = [];
  #destinations = [];
  #offersByType = [];
  #eventsApiService = null;

  constructor(eventsApiService) {
    super();
    // this.#points = points;
    // this.#destinations = destinations;
    // this.#offersByType = offersByType;
    this.#eventsApiService = eventsApiService;
  }

  async init() {
    try {
      this.#points = await this.#eventsApiService.points;
      this.#destinations = await this.#eventsApiService.destinations;
      this.#offersByType = await this.#eventsApiService.offersByType;
    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offersByType = [];
    }

    this._notify(UpdateType.INIT);
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

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    try{
      const updPoint = await this.#eventsApiService.updatePoint(update);
      this.#points = [
        ...this.points.slice(0, index),
        updPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try{
      const newPoint = await this.#eventsApiService.addPoint(update);
      this.#points = [
        newPoint,
        ...this.#points
      ];

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    try{
      const index = this.#points.findIndex((point) => point.id === update.id);
      await this.#eventsApiService.deletePoint(update);

      this.#points = [
        ...this.points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }

}

export {PointModel};
