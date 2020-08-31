const splitEventsByDays = (events) => {
  let date = ``;
  let counter = -1;
  const eventsByDays = [];
  const uniqueDates = [];
  const sorted = sortByStartDate(events);

  sorted.forEach((it) => {
    if (date === it.dateStart.toISOString().slice(0, 10)) {
      eventsByDays[counter].push(it);
    } else {
      eventsByDays[++counter] = [it];
      date = it.dateStart.toISOString().slice(0, 10);
      uniqueDates.push(new Date(date));
    }
  });

  return [eventsByDays, uniqueDates];
};

const sortByStartDate = (events = []) => {
  return events.slice().sort((a, b) => {
    return a.dateStart - b.dateStart;
  });
};

const sortByTime = (events = []) => {
  return events.slice().sort((a, b) => {
    return (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart);
  });
};

const sortByPrice = (events = []) => {
  return events.slice().sort((a, b) => {
    return b.price - a.price;
  });
};

export {splitEventsByDays, sortByStartDate, sortByTime, sortByPrice};
