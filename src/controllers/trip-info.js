import TripInfoComponent from '@/components/trip-info';
import PriceInfoComponent from '@/components/price-info';
import {render, replace, RenderPosition} from '@/utils/render';

export default class TripInfo {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;
    this._priceInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
  }

  render() {
    const events = this._eventsModel.getEventsAll();
    const oldTripInfoComponent = this._tripInfoComponent;
    const oldPriceInfoComponent = this._priceInfoComponent;

    this._tripInfoComponent = new TripInfoComponent(events);
    this._priceInfoComponent = new PriceInfoComponent(events);

    if (oldTripInfoComponent && oldPriceInfoComponent) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
      oldTripInfoComponent.removeElement();
      oldPriceInfoComponent.removeElement();
    } else {
      render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }

    const priceContainer = this._tripInfoComponent.getElement();

    render(priceContainer, this._priceInfoComponent, RenderPosition.BEFOREEND);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  _onDataChange() {
    this.render();
  }
}
