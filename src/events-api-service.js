import { Method } from './const.js';
import ApiService from './framework/api-service.js';

class EventsApiService extends ApiService {
  get points() {
    return this._load({url:'points'}).
      then(ApiService.parseResponse).
      then((points) => points.map(this.#toClientForm));
  }

  get destinations() {
    return this._load({url:'destinations'}).
      then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({url:'offers'}).
      then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#toServerForm(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return this.#toClientForm(parsedResponse);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#toServerForm(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return this.#toClientForm(parsedResponse);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });

    return response;
  }

  #toClientForm(point) {
    const clientPoint = {
      ...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite
    };

    delete clientPoint.base_price;
    delete clientPoint.date_from;
    delete clientPoint.date_to;
    delete clientPoint.is_favorite;

    return clientPoint;
  }

  #toServerForm(point) {
    const serverPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite
    };

    delete serverPoint.basePrice;
    delete serverPoint.dateFrom;
    delete serverPoint.dateTo;
    delete serverPoint.isFavorite;

    return serverPoint;
  }
}

export {EventsApiService};
