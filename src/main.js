import {ElemsDrawer} from './draw-elems.js';
import { PointModel } from './model/point-model.js';

const headerTrip = document.querySelector('.trip-main');
const controlsMenu = headerTrip.querySelector('.trip-controls');
const mainEvents = document.querySelector('.trip-events');
const pointModel = new PointModel();
const elemsDrawer = new ElemsDrawer(headerTrip, controlsMenu, mainEvents, pointModel);
elemsDrawer.init();
