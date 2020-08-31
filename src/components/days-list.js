import AbstractComponent from '@/components/abstract-component';

const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class DaysList extends AbstractComponent {
  getTemplate() {
    return createTripDaysListTemplate();
  }
}
