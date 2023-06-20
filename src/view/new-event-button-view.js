class newEventButtonView {
  #element = null;
  _callback = {};

  constructor() {
    this.#element = document.querySelector('.trip-main__event-add-btn');
    this.#element.addEventListener('click', this.#btnClickHandler);
  }

  get element() {
    return this.#element;
  }

  disable = () => {
    this.#element.disabled = true;
  };

  enable = () => {
    this.#element.disabled = false;
  };

  setBtnClickHandler = (callback) => {
    this._callback.btnClickHandler = callback;
  };

  #btnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.btnClickHandler();
  };
}

export {newEventButtonView};
