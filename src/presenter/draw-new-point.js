import { ActionType, UpdateType } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import { NewEventEditorView } from '../view/edit-event-view';

class NewPointDrawer {
  #eventsListContainer = null;
  #onPointUpdateHandler = null;
  #pointNewComponent = null;
  #pointDestroyHandler = null;

  constructor(eventsListCon, onPointUpdate, pointDestroy) {
    this.#eventsListContainer = eventsListCon;
    this.#onPointUpdateHandler = onPointUpdate;
    this.#pointDestroyHandler = pointDestroy;
  }

  init(point, destinations, offers){
    this.#pointNewComponent = new NewEventEditorView(point, destinations, offers);

    this.#pointNewComponent.setFormSubmitHandler((updPoint) => {
      this.#onPointUpdateHandler(
        ActionType.ADD_POINT,
        UpdateType.SMALL,
        updPoint
      );
      this.destroy();
    });

    this.#pointNewComponent.setFormResetHandler(() =>{
      this.destroy();
    });

    render(this.#pointNewComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keyup', this.#onEscKey);
  }

  #onEscKey = (evt) => {
    if (evt.key === 'Escape'){
      this.destroy();
    }
  };

  destroy = () => {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#pointDestroyHandler();

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keyup', this.#onEscKey);
  };
}

export {NewPointDrawer};
