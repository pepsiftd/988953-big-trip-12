import AbstractSmartComponent from '@/components/abstract-smart-component';
import {TabName} from '@/const';


const createTripTabsTemplate = (activeTabName) => {
  const tableTabActive = activeTabName === TabName.TABLE ? `trip-tabs__btn--active` : ``;
  const statsTabActive = activeTabName === TabName.STATS ? `trip-tabs__btn--active` : ``;

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn ${tableTabActive}" href="#" data-name="table">Table</a>
      <a class="trip-tabs__btn ${statsTabActive}" href="#" data-name="stats">Stats</a>
    </nav>`
  );
};

export default class TripTabs extends AbstractSmartComponent {
  constructor() {
    super();

    this._changeTabHandler = null;
    this._activeTab = TabName.TABLE;
  }

  getTemplate() {
    return createTripTabsTemplate(this._activeTab);
  }

  recoverListeners() {
    this.setChangeTabHandler(this._changeTabHandler);
  }

  setChangeTabHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const selectedTabName = evt.target.dataset.name;

      this._changeTabHandler = handler;

      if (this._activeTab !== selectedTabName) {
        this._activeTab = selectedTabName;
        this.rerender();
        handler(selectedTabName);
      }
    });
  }
}
