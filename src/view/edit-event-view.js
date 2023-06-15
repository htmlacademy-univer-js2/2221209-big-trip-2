import {POINT_TYPES, DateFormat} from '../const.js';
import {changeDateFormat} from '../util.js';
import AbstractView from '../framework/view/abstract-view.js';

const upFirstLetter = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;
const formatOfferTitle = (title) => title.split(' ').join('_');

const createEventEditorTemplate = (point, destinations, offersByType) => {
  const pointDestanation = destinations.find((dest) => dest.id === point.destination);
  const pointTypeOffers = offersByType.find((off) => off.type === point.type).offers;
  const pointId = point.id || 0;
  return(
    `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${POINT_TYPES.map((type) => (
      `<div class="event__type-item">
        <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${upFirstLetter(type)}</label>
      </div>`
    )).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointId}">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${pointDestanation ? pointDestanation.name : ''}" list="destination-list-${pointId}">
          <datalist id="destination-list-${pointId}">
            ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${changeDateFormat(point.dateFrom, DateFormat.EDIT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${changeDateFormat(point.dateTo, DateFormat.EDIT)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${point.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${point.id ? 'Save' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">${point.id ? 'Delete' : 'Cancel'}</button>
        ${point.id ? (
      `<button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
           </button>`
    ) : ''}

      </header>
      <section class="event__details">
      ${pointTypeOffers.length > 0 ? (
      `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${pointTypeOffers.map((typeOffer) =>
        `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${formatOfferTitle(typeOffer.title)}-${pointId}"
                type="checkbox" name="event-offer-${formatOfferTitle(typeOffer.title)}" ${point.offers.includes(typeOffer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${formatOfferTitle(typeOffer.title)}-${pointId}">
                <span class="event__offer-title">${typeOffer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${typeOffer.price}</span>
              </label>
            </div>
            `).join('')}
          </div>
        </section>`
    ) : ''}

        ${pointDestanation ? (
      `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestanation.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${pointDestanation.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}"></img>`).join('')}
            </div>
          </div>
        </section>`
    ) : ''}

      </section>
    </form>
  </li>
`);};

class NewEventEditorView extends AbstractView{
  #point = null;
  #destinations = [];
  #offers = [];

  constructor(point, destinations, offersByType) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offersByType;
  }

  get template() {
    return createEventEditorTemplate(this.#point, this.#destinations, this.#offers);
  }

  setRollupButtonClickHandler = (callback) => {
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn){
      this._callback.rollupButtonClick = callback;
      rollupBtn.addEventListener('click', this.#rollupButtonClickHandler);
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event--edit').addEventListener('reset', this.#formResetHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  #rollupButtonClickHandler = () => {
    this._callback.rollupButtonClick();
  };
}

export {NewEventEditorView};
