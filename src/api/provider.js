import EventModel from '@/models/event-model';
import {generateId, isOnline} from '@/utils/common';

const getStoreObjectFromArray = (items) => {
  const result = {};
  items.forEach((item) => {
    result[item.id] = item;
  });

  return result;
};

const getSyncedEvents = (response) => {
  const {created, updated} = response;
  const updatedEvents = updated.filter(({success}) => success)
    .map(({payload}) => payload.point);
  const events = created.concat(updatedEvents);

  return events;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  get isSyncRequired() {
    const storedSyncFlag = this._store.getSyncFlag();
    if (storedSyncFlag) {
      this._isSyncRequired = storedSyncFlag;
    }

    return this._isSyncRequired;
  }

  set isSyncRequired(value) {
    this._isSyncRequired = value;
    this._store.setSyncFlag(value);
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const eventsRAW = events.map((event) => event.toRAW());

          this._store.setEvents(getStoreObjectFromArray(eventsRAW));

          return events;
        });
    }

    const storedEvents = this._store.getEventsInArray();

    return Promise.resolve(EventModel.parseEvents(storedEvents));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);

          return offers;
        });
    }

    return Promise.resolve(this._store.getOffers());
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);

          return destinations;
        });
    }

    return Promise.resolve(this._store.getDestinations());
  }

  updateEvent(id, data) {
    if (isOnline()) {
      return this._api.updateEvent(id, data)
        .then((newEvent) => {
          this._store.setEvent(id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = EventModel.create(data);

    this._store.setEvent(id, localEvent.toRAW());
    this.isSyncRequired = true;

    return Promise.resolve(localEvent);
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setEvent(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = EventModel.create(Object.assign(event, {id: generateId()}));

    this._store.setEvent(localEvent.id, localEvent.toRAW());
    this.isSyncRequired = true;

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then((response) => {
          this._store.removeEvent(id);
          return response;
        });
    }

    this._store.removeEvent(id);
    this.isSyncRequired = true;

    return Promise.resolve({
      status: 200,
      body: `OK`,
    });
  }

  sync() {
    const storedEvents = this._store.getEventsInArray();

    if (isOnline()) {
      return this._api.sync(storedEvents)
        .then((response) => {
          const events = getSyncedEvents(response);

          this._store.setEvents(getStoreObjectFromArray(events));
          this.isSyncRequired = false;

          return EventModel.parseEvents(events);
        });
    }

    return Promise.reject(new Error(`Syncronization failed: OFFLINE`));
  }
}
