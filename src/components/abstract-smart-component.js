import AbstractComponent from '@/components/abstract-component';

export default class AbstractSmartComponent extends AbstractComponent {
  rerender() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parentElement.replaceChild(newElement, oldElement);

    this.recoverListeners();
  }

  recoverListeners() {
    throw new Error(`Abstract method not implemented: recoverListeners`);
  }
}
