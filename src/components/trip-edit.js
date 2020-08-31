import AbstractSmartComponent from '@/components/abstract-smart-component';
import {createEventDetailsMarkup} from '@/components/event-details';
import {createTypeListMarkup} from '@/components/event-type-list';
import {getEventTypeMarkup, getAvailableOffersByType, parseDate} from '@/utils/common';
import {SHAKE_ANIMATION_TIMEOUT, MS_IN_SECOND} from '@/const';
import EventModel from '@/models/event-model';
import {encode} from 'he';
import flatpickr from 'flatpickr';
import moment from 'moment';

import "flatpickr/dist/flatpickr.min.css";

const SaveButtonValue = {
  DEFAULT: `Save`,
  IN_PROGRESS: `Saving...`,
};

const DeleteButtonValue = {
  DEFAULT: `Delete`,
  IN_PROGRESS: `Deleting...`,
};

const getDestinationsListMarkup = (destinationNames) => {
  return destinationNames
    .map((it) => {
      return `<option value="${it}"></option>`;
    }).join(`\n`);
};

const getFavoriteButtonMarkup = (isNew, isFavorite) => {
  const favoriteCheckedMarkup = isFavorite ? `checked` : ``;

  return isNew ? `` : (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteCheckedMarkup}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const getFormattedDateTime = (date) => {
  return moment(date).format(`YY/MM/DD HH:mm`);
};

const createTripEditFormTemplate = (offersData, destinations, options = {}, isNewEvent = false) => {
  const {
    isFavorite,
    offers = [],
    destination,
    dateStart,
    dateEnd,
    price,
  } = options;

  const type = options.type ? options.type.toLowerCase() : ``;
  const typeMarkup = type ? getEventTypeMarkup(offersData, type) : ``;

  const typeListMarkup = createTypeListMarkup(type, offersData);

  const startTime = dateStart ? getFormattedDateTime(dateStart) : ``;
  const endTime = dateEnd ? getFormattedDateTime(dateEnd) : ``;

  const destinationNames = destinations.map((it) => it.name);
  const destinationsList = getDestinationsListMarkup(destinationNames);

  const eventTypeIconMarkup = `${type ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` : ``}`;
  const resetButtonMarkup = `<button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `Delete`}</button>`;
  const favoriteButtonMarkup = getFavoriteButtonMarkup(isNewEvent, isFavorite);
  const rollupButtonMarkup = isNewEvent ? `` : (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`);

  const availableOffers = getAvailableOffersByType(offersData, type);
  const destinationObject = destinations.find((it) => it.name === destination);
  const eventDetailsMarkup = destination || availableOffers.length > 0 ? createEventDetailsMarkup(offers, availableOffers, destinationObject) : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${eventTypeIconMarkup}
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${typeListMarkup}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeMarkup}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" pattern="[0-9]{1,}" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${resetButtonMarkup}

        ${favoriteButtonMarkup}

        ${rollupButtonMarkup}
      </header>
      ${eventDetailsMarkup}
    </form>`
  );
};

export default class TripEdit extends AbstractSmartComponent {
  constructor(event, offersData, destinations, isNewEvent) {
    super();
    this._event = event;
    this._offersData = offersData;
    this._destinations = destinations;
    this._isNewEvent = isNewEvent;

    this._submitHandler = null;
    this._deleteClickHandler = null;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._id = event.id;
    this._isFavorite = event.isFavorite;
    this._eventType = event.type;
    this._offers = event.offers;
    this._destination = event.destination ? encode(event.destination.name) : ``;
    this._startTime = event.dateStart;
    this._endTime = event.dateEnd;
    this._price = event.price ? parseInt(encode(String(event.price)), 10) : ``;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEditFormTemplate(
        this._offersData,
        this._destinations,
        {
          type: this._eventType,
          isFavorite: this._isFavorite,
          offers: this._offers,
          destination: this._destination,
          dateStart: this._startTime,
          dateEnd: this._endTime,
          price: this._price,
        },
        this._isNewEvent);
  }

  getData() {
    const data = {
      type: this._eventType,
      isFavorite: this._isFavorite,
      offers: this._offers,
      destination: Object.assign({}, this._destinations.find((dest) => dest.name === this._destination)),
      dateStart: this._startTime,
      dateEnd: this._endTime,
      price: this._price,
    };

    if (!this._isNewEvent) {
      data.id = this._id;
    }

    return EventModel.create(data);
  }

  parseForm() {
    const eventForm = this.getElement();

    const dateStartElement = eventForm.querySelector(`[name=event-start-time]`);
    const dateEndElement = eventForm.querySelector(`[name=event-end-time]`);
    const priceElement = eventForm.querySelector(`[name=event-price]`);
    const favoriteButton = eventForm.querySelector(`[name=event-favorite]`);

    this._startTime = parseDate(dateStartElement.value);
    this._endTime = parseDate(dateEndElement.value);
    this._price = parseInt(encode(priceElement.value), 10);
    this._isFavorite = favoriteButton ? favoriteButton.checked : false;
  }

  validateForm() {
    const eventForm = this.getElement();

    const destinationInput = eventForm.querySelector(`[name=event-destination]`);
    const priceInput = eventForm.querySelector(`[name=event-price]`);
    const dateStartElement = eventForm.querySelector(`[name=event-start-time]`);
    const dateEndElement = eventForm.querySelector(`[name=event-end-time]`);

    const destinationValue = encode(destinationInput.value);
    const priceValue = parseInt(encode(priceInput.value), 10);

    if (!this._destinations.some((it) => it.name === destinationValue)) {
      destinationInput.setCustomValidity(`Unknown destination. Please choose from list.`);
      return false;
    }

    if (!this._eventType || !dateStartElement.value || !dateEndElement.value || !priceValue) {
      return false;
    }

    return true;
  }

  disableForm() {
    const formElement = this.getElement();
    const formElements = Array.from(formElement.elements);
    formElements.forEach((element) => {
      element.disabled = true;
    });
  }

  enableForm() {
    const formElement = this.getElement();
    const formElements = Array.from(formElement.elements);
    formElements.forEach((element) => {
      element.disabled = false;
    });
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MS_IN_SECOND}s`;

    setTimeout(() => {
      this.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  toggleSaveSaving() {
    const saveButton = this.getElement().querySelector(`.event__save-btn`);
    switch (saveButton.textContent) {
      case SaveButtonValue.DEFAULT:
        saveButton.textContent = SaveButtonValue.IN_PROGRESS;
        break;
      case SaveButtonValue.IN_PROGRESS:
        saveButton.textContent = SaveButtonValue.DEFAULT;
        break;
    }
  }

  toggleDeleteDeleting() {
    const deleteButton = this.getElement().querySelector(`.event__reset-btn`);
    switch (deleteButton.textContent) {
      case DeleteButtonValue.DEFAULT:
        deleteButton.textContent = DeleteButtonValue.IN_PROGRESS;
        break;
      case DeleteButtonValue.IN_PROGRESS:
        deleteButton.textContent = DeleteButtonValue.DEFAULT;
        break;
    }
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    this.getElement().addEventListener(`submit`, handler);
  }

  setDeleteClickHandler(handler) {
    this._deleteClickHandler = handler;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
  }

  setFavoriteClickHandler(handler) {
    this._favoriteClickHandler = handler;
    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    favoriteButton.addEventListener(`change`, () => {
      favoriteButton.checked = !favoriteButton.checked;
      this._isFavorite = !this._isFavorite;
      handler();
    });
  }

  setRollupButtonClickHandler(handler) {
    this._rollupButtonClickHandler = handler;

    if (!this._isNewEvent) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    }
  }

  reset() {
    this._isFavorite = this._event.isFavorite;
    this._eventType = this._event.type;
    this._offers = this._event.offers;
    this._destination = this._event.destination ? encode(this._event.destination.name) : ``;
    this._startTime = this._event.dateStart;
    this._endTime = this._event.dateEnd;
    this._price = this._event.price ? parseInt(encode(String(this._event.price)), 10) : ``;

    this.rerender();
  }

  recoverListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteClickHandler(this._deleteClickHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  removeElement() {
    super.removeElement();
    this._destroyFlatpickr();
  }

  _applyFlatpickr() {
    this._destroyFlatpickr();

    const dateStartElement = this.getElement().querySelector(`[name=event-start-time]`);
    const dateEndElement = this.getElement().querySelector(`[name=event-end-time]`);

    this._flatpickrStart = flatpickr(dateStartElement, {
      enableTime: true,
      minuteIncrement: 1,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._startTime || `today`,
      onChange: (selectedDates) => {
        this._startTime = selectedDates[0];

        if (this._flatpickrEnd.config._minDate < this._startTime) {
          this._flatpickrEnd.setDate(this._startTime, false, `d/m/y H:i`);
        }

        this._flatpickrEnd.set(`minDate`, this._startTime);
      },
    });

    this._flatpickrEnd = flatpickr(dateEndElement, {
      enableTime: true,
      minuteIncrement: 1,
      dateFormat: `d/m/y H:i`,
      minDate: this._startTime,
      defaultDate: this._endTime || `today`,
      onChange: (selectedDates) => {
        this._endTime = selectedDates[0];
      },
    });
  }

  _destroyFlatpickr() {
    if (this._flatpickrStart || this._flatpickrEnd) {
      this._flatpickrStart.onChange = null;
      this._flatpickrEnd.onChange = null;
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = parseInt(evt.target.value, 10) ? parseInt(evt.target.value, 10) : ``;
    });

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._eventType = evt.target.value;
      this._offers = [];
      this.rerender();
    });

    const destinationInput = element.querySelector(`.event__input--destination`);
    destinationInput.addEventListener(`input`, () => {
      this._destination = destinationInput.value ? encode(destinationInput.value) : ``;
      if (this._destinations.some((it) => it.name === this._destination)) {
        this.rerender();
      }
    });

    const offersSelectElement = element.querySelector(`.event__available-offers`);
    if (offersSelectElement) {
      offersSelectElement.addEventListener(`change`, () => {
        const getSelectedOffers = () => {
          const checkedOfferInputs = offersSelectElement.querySelectorAll(`.event__offer-checkbox`);
          const checkedOfferIndexes = [];

          checkedOfferInputs.forEach((input, index) => {
            if (input.checked === true) {
              checkedOfferIndexes.push(index);
            }
          });

          return checkedOfferIndexes.map((index) => getAvailableOffersByType(this._offersData, this._eventType)[index]);
        };

        this._offers = getSelectedOffers();
      });
    }
  }
}
