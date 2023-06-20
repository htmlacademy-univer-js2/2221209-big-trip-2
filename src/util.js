import dayjs from 'dayjs';
import { FilterType, POINT_TYPES } from './const.js';

const changeDateFormat = (rawDate, dateFormat) => dayjs(rawDate).format(dateFormat);
const getDuration = (startDate, endDate) => {
  const days = dayjs(endDate).diff(dayjs(startDate), 'd');
  const hours = dayjs(endDate).subtract(days, 'd').diff(dayjs(startDate), 'h');
  const minutes = dayjs(endDate).subtract(days, 'd').subtract(hours, 'h').diff(dayjs(startDate), 'm');

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

const getDefaultPoint = () => ({
  'basePrice': 0,
  'dateFrom': new Date().toISOString(),
  'dateTo': new Date().toISOString(),
  'destination': 0,
  'isFavorite': false,
  'offers': [],
  'type': POINT_TYPES[0]
});

const updateItems = (items, updatedItem) => items.map((item) => item.id === updatedItem.id ? updatedItem : item);

const sortByDay = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));

const sortByPrice = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;

const sortByTime = (firstPoint, secondPoint) => {
  const firstPointTime = dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
  const secondPointTime = dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom));
  return secondPointTime - firstPointTime;
};

const getOfferId = (markupId) => {
  const assets = markupId.split('-');
  return Number(assets[2]) || 0;
};

const filterPoints = (points, filterType) => {
  switch (filterType) {
    case FilterType.PAST:
      return [...points.filter((point) => new Date(point.dateTo).getTime() < Date.now())];
    case FilterType.FUTURE:
      return [...points.filter((point) => new Date(point.dateTo).getTime() > Date.now())];
  }
  return [...points];
};

const isPatchUpdate = (point, update) => point.basePrice === update.basePrice && point.dateTo === update.dateTo && point.dateFrom === update.dateFrom;

export {changeDateFormat, getDuration, getDefaultPoint, updateItems, sortByDay, sortByPrice, sortByTime, getOfferId, isPatchUpdate, filterPoints};
