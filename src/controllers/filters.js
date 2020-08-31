import FiltersComponent from '@/components/trip-filters';
import {getEventsByFilter} from '@/utils/filter';
import {render, replace, RenderPosition} from '@/utils/render';
import {FilterType} from '@/const';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

export default class Filters {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filtersComponent = null;

    this._activeFilter = FilterType.EVERYTHING;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._isFutureEmpty = true;
    this._isPastEmpty = true;
    this._checkEventsAmount();
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  setFilter(filterType) {
    if (filterType === this._activeFilter) {
      return;
    }

    this._activeFilter = filterType;
    this._onFilterChange({target: {id: filterType}});
    this.render();
  }

  render() {
    const oldFilterComponent = this._filtersComponent;
    this._filtersComponent = new FiltersComponent(this._isFutureEmpty, this._isPastEmpty);

    if (oldFilterComponent) {
      replace(this._filtersComponent, oldFilterComponent);
      oldFilterComponent.removeElement();
    } else {
      render(this._container, this._filtersComponent, RenderPosition.BEFOREEND);
    }

    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
  }

  _checkEventsAmount() {
    this._isFutureEmpty = getEventsByFilter(this._eventsModel.getEventsAll(), FilterType.FUTURE).length === 0;
    this._isPastEmpty = getEventsByFilter(this._eventsModel.getEventsAll(), FilterType.PAST).length === 0;
  }

  _onFilterChange(evt) {
    const selectedFilter = getFilterNameById(evt.target.id);

    this._eventsModel.setActiveFilter(selectedFilter);
    this._activeFilter = selectedFilter;
  }

  _onDataChange() {
    this._checkEventsAmount();
    this.render();
  }
}
