import {createDestinationMarkup} from '@/components/destination';
import {createOfferSelectorsMarkup} from '@/components/offers-full';

export const createEventDetailsMarkup = (selectedOffers = [], availableOffers = [], destination) => {
  const destinationMarkup = destination ? createDestinationMarkup(destination) : ``;
  const offersMarkup = availableOffers.length > 0 ? createOfferSelectorsMarkup(selectedOffers, availableOffers) : ``;

  return (
    `<section class="event__details">
      ${offersMarkup}

      ${destinationMarkup}
    </section>`
  );
};
