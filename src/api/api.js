import Event from '@/models/event-model';

const SERVER_URL = `https://12.ecmascript.pages.academy/big-trip/`;
const AUTHORIZATION = `Basic gb1s4h387jh654a`;

const URL = {
  EVENTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`,
  SYNC: `points/sync`,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor() {
    this._authorization = AUTHORIZATION;
  }

  getEvents() {
    return this._load(URL.EVENTS)
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  getOffers() {
    return this._load(URL.OFFERS)
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load(URL.DESTINATIONS)
      .then((response) => response.json());
  }

  updateEvent(id, data) {
    const headers = new Headers();
    headers.append(`Content-Type`, `application/json`);

    return this._load(`${URL.EVENTS}/${id}`,
        Method.PUT,
        JSON.stringify(data.toRAW()),
        headers).then((response) => response.json())
      .then(Event.parseEvent);
  }

  createEvent(event) {
    return this._load(URL.EVENTS,
        Method.POST,
        JSON.stringify(event.toRAW()),
        new Headers({"Content-Type": `application/json`})
    ).then((response) => response.json())
    .then(Event.parseEvent);
  }

  deleteEvent(id) {
    return this._load(`${URL.EVENTS}/${id}`, Method.DELETE);
  }

  sync(data) {
    return this._load(
        URL.SYNC,
        Method.POST,
        JSON.stringify(data),
        new Headers({"Content-Type": `application/json`})
    )
      .then((response) => response.json());
  }

  _load(sub, method = Method.GET, body = null, headers = new Headers()) {
    headers.append(`Authorization`, this._authorization);

    return fetch(SERVER_URL + sub, {
      headers,
      method,
      body,
    }).then(checkStatus);
  }
}
