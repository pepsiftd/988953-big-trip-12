import AbstractComponent from '@/components/abstract-component';

const getTotalCost = (events) => {
  return events.reduce((total, event) => {
    const offersCost = event.offers.length > 0 ? event.offers.reduce(((offersTotal, offer) => offersTotal + offer.price), 0) : 0;
    return total + event.price + offersCost;
  }, 0);
};

const createPriceInfoTemplate = (events) => {
  const totalCost = getTotalCost(events);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class PriceInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createPriceInfoTemplate(this._events);
  }
}
