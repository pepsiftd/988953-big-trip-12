import moment from 'moment';
import {nanoid} from 'nanoid';

const isOnline = () => {
  return window.navigator.onLine;
};

const generateId = () => {
  return nanoid();
};

const parseDate = (dateString) => {
  const day = dateString.slice(0, 2);
  const month = dateString.slice(3, 5);
  return new Date(`${month}/${day}/20${dateString.slice(6)}`);
};

const getDuration = (startDate, endDate) => {
  const duration = endDate ? moment.duration(endDate - startDate) : moment.duration(startDate);
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${days ? addLeadingZero(days) + `D ` : ``}${hours ? addLeadingZero(hours) + `H ` : ``}${minutes !== 0 || !hours && !days ? addLeadingZero(minutes) + `M` : ``}`;
};

const addLeadingZero = (time) => {
  return (`00` + time).slice(-2);
};

const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const getEventTypeMarkup = (offersData, type) => {
  const capitalizedType = capitalizeFirstLetter(type);

  return capitalizedType + (offersData.TRANSFER.has(type) ? ` to` : ` in`);
};

const getAvailableOffersByType = (offersData, type) => {
  if (!type) {
    return [];
  }

  return offersData.TRANSFER.get(type) ? offersData.TRANSFER.get(type) : offersData.ACTIVITY.get(type);
};

const getRandomInteger = (min, max) => {
  return min + Math.round(Math.random() * (max - min));
};

const enableNewEventButton = () => {
  document.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

const disableNewEventButton = () => {
  document.querySelector(`.trip-main__event-add-btn`).disabled = true;
};

const getUniqueItems = (itemsList) => {
  return itemsList.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
};

const getDifferenceInDays = (start, end) => {
  const MS_IN_DAY = 86400000;

  return Math.floor((end - start) / MS_IN_DAY);
};

export {
  parseDate,
  getDuration,
  addLeadingZero,
  capitalizeFirstLetter,
  getEventTypeMarkup,
  getAvailableOffersByType,
  getRandomInteger,
  enableNewEventButton,
  disableNewEventButton,
  generateId,
  isOnline,
  getUniqueItems,
  getDifferenceInDays,
};
