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
const ActionType = {
  UPDATE_POINT: 'update',
  ADD_POINT: 'add',
  DELETE_POINT: 'delete'
};
const UpdateType = {
  PATCH: 'patch',
  SMALL: 'small',
  BIG: 'big',
  INIT: 'init'
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};
const EmptyListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now'
};
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};
const Server = {
  SERVER: 'https://18.ecmascript.pages.academy/big-trip',
  AUTHORIZATION: 'Basic sfdgsdfgsf876bp'
};

export {POINT_TYPES, DateFormat, PointState, SortType, ActionType, UpdateType, FilterType, EmptyListText, Method, Server};
