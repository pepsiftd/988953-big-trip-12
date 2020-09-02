import AbstractComponent from '@/components/abstract-component';
import {FilterType} from '@/const';

const createTripFiltersTemplate = (isFutureInputDisabled, isPastInputDisabled, activeFilter) => {
  const futureDisabledMarkup = isFutureInputDisabled ? `disabled` : ``;
  const pastDisabledMarkup = isPastInputDisabled ? `disabled` : ``;

  const everythingCheckedMarkup = activeFilter === FilterType.EVERYTHING ? `checked` : ``;
  const futureCheckedMarkup = activeFilter === FilterType.FUTURE ? `checked` : ``;
  const pastCheckedMarkup = activeFilter === FilterType.PAST ? `checked` : ``;

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${everythingCheckedMarkup}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${futureDisabledMarkup} ${futureCheckedMarkup}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${pastDisabledMarkup} ${pastCheckedMarkup}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class TripFilters extends AbstractComponent {
  constructor(isFutureInputDisabled, isPastInputDisabled, activeFilter) {
    super();

    this._activeFilter = activeFilter;
    this._isFutureInputDisabled = isFutureInputDisabled;
    this._isPastInputDisabled = isPastInputDisabled;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._isFutureInputDisabled, this._isPastInputDisabled, this._activeFilter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      this._activeFilter = evt.target.value;
      handler(evt);
    });
  }
}
