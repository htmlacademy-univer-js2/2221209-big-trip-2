const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DateFormat = {
  DAY: 'DD MMM',
  VIEW: 'hh:mm',
  EDIT: 'DD/MM/YY hh:mm',
  SERVICE: 'YYYY-MM-DDThh:mm',
  SERVICE_DAY: 'YYYY-MM-DD',
  DATE_PICKER: 'd/m/y H:i'
};
const PointState = {
  VIEW: 'view',
  EDIT: 'edit'
};
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export {POINT_TYPES, DateFormat, PointState, SortType};
