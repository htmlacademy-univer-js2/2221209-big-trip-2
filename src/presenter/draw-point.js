import { ActionType, PointState, UpdateType } from '../const';
import { remove, render, replace } from '../framework/render';
import { isPatchUpdate } from '../util';
import { NewEventEditorView } from '../view/edit-event-view';
import { NewEventView } from '../view/event-view';

class PointDrawer {
  #eventsListContainer = null;
  #onPointUpdateHandler = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #pointState = PointState.VIEW;
  #pointsResetHandler = null;
  #point = null;

  constructor(eventsListCon, onPointUpdate, pointsReset) {
    this.#eventsListContainer = eventsListCon;
    this.#onPointUpdateHandler = onPointUpdate;
    this.#pointsResetHandler = pointsReset;
  }

  init(point, destinations, offers){
    const pervPointComponent = this.#pointComponent;
    const pervPointEditComponent = this.#pointEditComponent;

    this.#point = point;
    this.#pointComponent = new NewEventView(this.#point, destinations, offers);
    this.#pointEditComponent = new NewEventEditorView(this.#point, destinations, offers);

    this.#pointComponent.setRollupButtonClickHandler(() => {
      this.#turnPointToEdit();
    });

    this.#pointEditComponent.setRollupButtonClickHandler(() => {
      this.#turnPointToView();
    });

    this.#pointEditComponent.setFormSubmitHandler((updPoint) => {
      const isPatch = isPatchUpdate(this.#point, updPoint);
      this.#onPointUpdateHandler(
        ActionType.UPDATE_POINT,
        isPatch ? UpdateType.PATCH : UpdateType.SMALL,
        updPoint
      );
      this.#turnPointToView();
    });

    this.#pointEditComponent.setFormResetHandler(() =>{
      this.#onPointUpdateHandler(
        ActionType.DELETE_POINT,
        UpdateType.SMALL,
        this.#point
      );
    });

    this.#pointComponent.setFavButtonClickHandler(() => {
      this.#onPointUpdateHandler(
        ActionType.UPDATE_POINT,
        UpdateType.SMALL,
        {...this.#point,
          isFavorite: !this.#point.isFavorite});
    });

    if (pervPointComponent === null || pervPointEditComponent === null){
      render(this.#pointComponent, this.#eventsListContainer);
      return;
    }

    if (this.#eventsListContainer.contains(pervPointComponent.element)){
      replace(this.#pointComponent, pervPointComponent);
    }

    if (this.#eventsListContainer.contains(pervPointEditComponent.element)){
      replace(this.#pointEditComponent, pervPointEditComponent);
    }
    remove(pervPointComponent);
    remove(pervPointEditComponent);
  }

  #onEscKey = (evt) => {
    if (evt.key === 'Escape'){
      this.resetPoint();
    }
  };

  #turnPointToEdit = () => {
    this.#pointsResetHandler();
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointState = PointState.EDIT;
    document.addEventListener('keyup', this.#onEscKey);
  };

  #turnPointToView = () => {
    this.#pointEditComponent.reset();
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#pointState = PointState.VIEW;
    document.removeEventListener('keyup', this.#onEscKey);
  };

  resetPoint = () => {
    if (this.#pointState === PointState.EDIT){
      this.#turnPointToView();
    }
  };

  removeDrawer = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };
}

export {PointDrawer};
