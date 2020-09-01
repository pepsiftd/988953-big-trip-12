import AbstractSmartComponent from '@/components/abstract-smart-component';

const SORT_TYPE_PREFIX = `sort-`;

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const createTripSortTemplate = (activeSortType) => {
  const dayItemMarkup = activeSortType === SortType.EVENT ? `Days` : ``;
  const checkedTypeMarkup = new Map();
  Object.values(SortType).forEach((type) => {
    checkedTypeMarkup.set(type, type === activeSortType ? `checked` : ``);
  });

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${dayItemMarkup}</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" ${checkedTypeMarkup.get(SortType.EVENT)}>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${checkedTypeMarkup.get(SortType.TIME)}>
        <label class="trip-sort__btn" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${checkedTypeMarkup.get(SortType.PRICE)}>
        <label class="trip-sort__btn" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class TripSort extends AbstractSmartComponent {
  constructor(activeSortType) {
    super();

    this._activeSortType = activeSortType;
    this._sortTypeChangeHandler = null;
  }

  getTemplate() {
    return createTripSortTemplate(this._activeSortType);
  }

  setSortType(type) {
    if (type === this._activeSortType) {
      return false;
    }

    this._activeSortType = type;
    this.rerender();

    return true;
  }

  recoverListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  setSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandler = handler;

    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = evt.target.value.substring(SORT_TYPE_PREFIX.length);

      if (sortType === this._activeSortType) {
        return;
      }

      this._activeSortType = sortType;
      this.rerender();

      this._sortTypeChangeHandler(sortType);
    });
  }
}
