import EventComponent from '@/components/trip-event';
import EditEventComponent from '@/components/trip-edit';
import {RenderPosition, replace, render, remove} from '@/utils/render';
import {enableNewEventButton} from '@/utils/common';
import {Key, EventType} from '@/const';
import EventModel from '@/models/event-model';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const IS_NO_CLOSE = true;

const EMPTY_EVENT = {
  type: EventType.TRANSFER[1],
  isFavorite: false,
  destination: undefined,
  dateStart: new Date(),
  dateEnd: new Date(),
  price: undefined,
  offers: [],
  description: undefined,
  photos: undefined,
};

class Event {
  constructor(container, onDataChange, onViewChange, mode) {
    this._container = container;
    this._mode = mode ? mode : Mode.DEFAULT;
    this._event = null;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._escPressHandler = this._escPressHandler.bind(this);
    this._normalModeRollupButtonClickHandler = this._normalModeRollupButtonClickHandler.bind(this);
    this._editModeRollupButtonClickHandler = this._editModeRollupButtonClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
  }

  replaceDefaultWithEdit() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._escPressHandler);
  }

  replaceEditWithDefault() {
    replace(this._eventComponent, this._editEventComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escPressHandler);
  }

  _setEventListeners() {
    this._eventComponent.setRollupButtonClickHandler(this._normalModeRollupButtonClickHandler);
    this._editEventComponent.setRollupButtonClickHandler(this._editModeRollupButtonClickHandler);
    this._editEventComponent.setSubmitHandler(this._submitHandler);
    this._editEventComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (this._mode !== Mode.ADDING) {
      this._editEventComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this.replaceEditWithDefault();
    }
  }

  toggleSaveSaving() {
    this._editEventComponent.toggleSaveSaving();
  }

  toggleDeleteDeleting() {
    this._editEventComponent.toggleDeleteDeleting();
  }

  render(event, offersData, destinations, isFirst) {
    this._event = event;
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event, offersData);
    this._editEventComponent = new EditEventComponent(event, offersData, destinations, this._mode === Mode.ADDING);

    this._setEventListeners();

    if (oldEventComponent && oldEditEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editEventComponent, oldEditEventComponent);
    } else if (this._mode === Mode.ADDING) {
      document.addEventListener(`keydown`, this._escPressHandler);

      if (isFirst) {
        render(this._container, this._editEventComponent, RenderPosition.BEFOREEND);
      } else {
        const sortingElement = this._container.querySelector(`.trip-sort`);
        render(sortingElement, this._editEventComponent, RenderPosition.AFTER);
      }
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  shake() {
    this._editEventComponent.shake();
  }

  disableForm() {
    this._editEventComponent.disableForm();
  }

  enableForm() {
    this._editEventComponent.enableForm();
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
    document.removeEventListener(`keydown`, this._escPressHandler);
  }

  _escPressHandler(evt) {
    if (evt.key === Key.ESC) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EMPTY_EVENT, null);
        document.removeEventListener(`keydown`, this._escPressHandler);
        return;
      }

      this._editEventComponent.reset();
      this.replaceEditWithDefault();
    }
  }

  _normalModeRollupButtonClickHandler() {
    this.replaceDefaultWithEdit();
  }

  _editModeRollupButtonClickHandler() {
    this._editEventComponent.reset();
    this.replaceEditWithDefault();
  }

  _deleteClickHandler() {
    this._onDataChange(this, this._event, null);
    if (this._mode === Mode.ADDING) {
      enableNewEventButton();
    }
  }

  _favoriteClickHandler() {
    this._onDataChange(this, this._event, EventModel.create(Object.assign({}, this._event, {isFavorite: !this._event.isFavorite})), IS_NO_CLOSE);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    const isValid = this._editEventComponent.validateForm();
    if (isValid) {
      this._editEventComponent.parseForm();

      if (this._mode === Mode.ADDING) {
        this._mode = Mode.DEFAULT;
      }

      this._onDataChange(this, this._event, this._editEventComponent.getData());
    } else {
      this.shake();
    }
  }
}

export default Event;
export {Mode, EMPTY_EVENT};
