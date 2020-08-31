export default class EventModel {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.destination = data[`destination`];
    this.dateStart = new Date(data[`date_from`]);
    this.dateEnd = new Date(data[`date_to`]);
    this.price = parseInt(data[`base_price`], 10);
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.dateStart,
      "date_to": this.dateEnd,
      "destination": this.destination,
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "type": this.type
    };
  }

  static create(data) {
    return new EventModel({
      "base_price": data.price,
      "date_from": data.dateStart,
      "date_to": data.dateEnd,
      "destination": data.destination,
      "id": data.id,
      "is_favorite": data.isFavorite,
      "offers": data.offers,
      "type": data.type
    });
  }

  static parseEvent(data) {
    return new EventModel(data);
  }

  static parseEvents(data) {
    return data.map(EventModel.parseEvent);
  }
}
