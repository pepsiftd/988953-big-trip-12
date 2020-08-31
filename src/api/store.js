const Key = {
  EVENTS: `events`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`,
  SYNC: `sync_required`,
};

export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  _getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      throw new Error(`Can't read storage: ${err}`);
    }
  }

  _setItem(key, value) {
    const store = this._getItems();

    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, {
      [key]: value
    })));
  }

  getEvents() {
    return this._getItems()[Key.EVENTS];
  }

  getEventsInArray() {
    return Object.values(this.getEvents());
  }

  getDestinations() {
    return this._getItems()[Key.DESTINATIONS];
  }

  getOffers() {
    return this._getItems()[Key.OFFERS];
  }

  getSyncFlag() {
    return this._getItems()[Key.SYNC];
  }

  removeEvent(id) {
    const storedEvents = this.getEvents();
    delete storedEvents[id];
    this.setEvents(storedEvents);
  }

  setEvent(id, event) {
    const storedEvents = this.getEvents();

    this.setEvents(Object.assign({}, storedEvents, {
      [id]: event
    }));
  }

  setEvents(events) {
    this._setItem(Key.EVENTS, events);
  }

  setOffers(offers) {
    this._setItem(Key.OFFERS, offers);
  }

  setDestinations(destinations) {
    this._setItem(Key.DESTINATIONS, destinations);
  }

  setSyncFlag(value) {
    this._setItem(Key.SYNC, value);
  }
}
