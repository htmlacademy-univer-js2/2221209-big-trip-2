import { PointState } from '../const';
import { remove, render, replace } from '../framework/render';
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

    const onEscKey = (evt) => {
      if (evt.key === 'Escape'){
        this.resetPoint();
        document.removeEventListener('keyup', onEscKey);
      }
    };

    this.#pointComponent.setRollupButtonClickHandler(() => {
      this.#turnPointToEdit();
      document.addEventListener('keyup', onEscKey);
    });

    this.#pointEditComponent.setRollupButtonClickHandler(() => {
      this.#pointEditComponent.reset(this.#point);
      this.#turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    this.#pointEditComponent.setFormSubmitHandler((updPoint) => {
      this.#onPointUpdateHandler(updPoint);
      this.#turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    this.#pointEditComponent.setFormResetHandler(() =>{
      this.#pointEditComponent.reset(this.#point);
      this.#turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    this.#pointComponent.setFavButtonClickHandler(() => {
      this.#onPointUpdateHandler({
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
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

  #turnPointToEdit = () => {
    this.#pointsResetHandler();
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointState = PointState.EDIT;
  };

  #turnPointToView = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#pointState = PointState.VIEW;
  };

  resetPoint = () => {
    if (this.#pointState === PointState.EDIT){
      this.#pointEditComponent.reset(this.#point);
      this.#turnPointToView();
    }
  };

  removeDrawer = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };
}

export {PointDrawer};
