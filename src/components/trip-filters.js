import AbstractComponent from '@/components/abstract-component';

const createTripFiltersTemplate = (isFutureInputDisabled, isPastInputDisabled) => {
  const futureDisabledClass = isFutureInputDisabled ? `disabled` : ``;
  const pastDisabledClass = isPastInputDisabled ? `disabled` : ``;

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${futureDisabledClass}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${pastDisabledClass}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class TripFilters extends AbstractComponent {
  constructor(isFutureInputDisabled, isPastInputDisabled) {
    super();

    this._isFutureInputDisabled = isFutureInputDisabled;
    this._isPastInputDisabled = isPastInputDisabled;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._isFutureInputDisabled, this._isPastInputDisabled);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, handler);
  }
}
