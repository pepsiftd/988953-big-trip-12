import AbstractComponent from '@/components/abstract-component';

export default class Loading extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }
}
