import AbstractComponent from '@/components/abstract-component';

const createDayTemplate = (day, counter) => {
  const dayCounterMarkup = counter ? `<span class="day__counter">${counter}</span>` : ``;
  const dayDateMarkup = day ? `<time class="day__date" datetime="${day.toISOString(). slice(0, 10)}">${day.toString().slice(4, 10)}</time>` : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayCounterMarkup}
        ${dayDateMarkup}
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(day, counter) {
    super();
    this._day = day;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._counter);
  }
}
