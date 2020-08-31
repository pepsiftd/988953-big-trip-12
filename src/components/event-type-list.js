import {capitalizeFirstLetter} from '@/utils/common';

const createTypeItemMarkup = (type, isChecked) => {
  const labelValue = capitalizeFirstLetter(type);
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${labelValue}</label>
    </div>`
  );
};

const createTypesListMarkup = (selectedType, typesList) => {
  return typesList.map((type) => createTypeItemMarkup(type, type === selectedType)).join(`\n`);
};

export const createTypeListMarkup = (selectedType, offers) => {
  const transferEventTypes = Array.from(offers.TRANSFER.keys());
  const activityEventTypes = Array.from(offers.ACTIVITY.keys());
  const transferList = createTypesListMarkup(selectedType, transferEventTypes);
  const activityList = createTypesListMarkup(selectedType, activityEventTypes);

  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>

        ${transferList}
      </fieldset>

      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>

        ${activityList}
      </fieldset>
    </div>`
  );
};
