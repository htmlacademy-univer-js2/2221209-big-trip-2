import {NewFilterView} from './view/filter-view.js';
import {NewNavView} from './view/nav-view.js';
import {NewInfoView} from './view/info-view.js';
import {NewSortView} from './view/sort-view.js';
import {NewEventView} from './view/event-view.js';
import {NewElemListView} from './view/events-list-view.js';
import {NewEventCreatorView} from './view/create-event-view.js';
import {NewEventEditorView} from './view/edit-event-view.js';
import {render} from './render.js';

const init = () => {
    const headerTrip = document.querySelector('.trip-main');
    const siteMenuElement = headerTrip.querySelector('.trip-controls__navigation');

    const siteFilterElement = headerTrip.querySelector('.trip-controls__filters');

    const mainEvents = document.querySelector('.trip-events');
    
    render(new NewInfoView(), headerTrip, 'afterbegin')
    render(new NewNavView(), siteMenuElement);
    render(new NewFilterView(), siteFilterElement);
    render(new NewSortView(), mainEvents);

    render(new NewElemListView(), mainEvents);

    const eventsList = mainEvents.getElementsByClassName('trip-events__list');

    [1, 2, 3].forEach(() => {
        render(new NewEventView(), eventsList[0]);
    });

    const events = mainEvents.getElementsByClassName('trip-events__item');

    render(new NewEventCreatorView(), eventsList[0], 'afterbegin');
    render(new NewEventEditorView(), events[1], 'afterend');
};

export {init};