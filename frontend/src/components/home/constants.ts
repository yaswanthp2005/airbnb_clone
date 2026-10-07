/** "Popular homes in {city}" rows, for the first featured destinations. */
export const POPULAR_CITY_ROW_COUNT = 6;

export const ROW_SKELETON_COUNT = 8;

/** Destination photos in the first visible row load eagerly. */
export const DESTINATION_EAGER_COUNT = 10;

/** Cards per visible row, matching the gap-4 (1rem) scroller: 10 destinations / 7 homes on wide screens. */
export const DESTINATION_CARD_WIDTH_CLASS_NAME =
  "w-[calc((100%-1rem)/2.3)] sm:w-[calc((100%-3rem)/4)] md:w-[calc((100%-4rem)/5)] lg:w-[calc((100%-7rem)/8)] xl:w-[calc((100%-9rem)/10)]";

export {
  HOME_ROW_CARD_IMAGE_SIZES as HOME_CARD_IMAGE_SIZES,
  HOME_ROW_CARD_WIDTH_CLASS_NAME as HOME_CARD_WIDTH_CLASS_NAME,
  HOME_ROW_RATING_FORMAT as RATING_FORMAT,
} from "@/components/listings/constants";

export const DESTINATION_IMAGE_SIZES =
  "(min-width: 1280px) 10vw, (min-width: 1024px) 13vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 45vw";
