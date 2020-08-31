const createPhotoMarkup = (photos) => {
  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }).join(`\n`);
};

export const createDestinationMarkup = (destination) => {
  const {description, pictures = []} = destination;

  const photosMarkup = createPhotoMarkup(pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
    </section>`
  );
};
