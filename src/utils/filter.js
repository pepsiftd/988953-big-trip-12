import {FilterType} from '@/const';

const getEventsByFilter = (events, filterType) => {
  let filteredEvents = [];

  switch (filterType) {
    case FilterType.FUTURE:
      filteredEvents = events.filter((event) => {
        return event.dateStart > Date.now();
      });
      break;

    case FilterType.PAST:
      filteredEvents = events.filter((event) => {
        return event.dateEnd < Date.now();
      });
      break;

    default:
      filteredEvents = events;
  }

  return filteredEvents;
};

export {getEventsByFilter};
