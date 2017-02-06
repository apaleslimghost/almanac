import createStore from 'enviante';
import localStore from '@quarterto/enviante-localstorage';
import {createObserve} from 'enviante-react';

const connect = createStore({
	date: 48864384000,
	objectives: {},
});

if(typeof localStorage !== 'undefined') {
	localStore('date', 'date', 48864384000)(connect);
	localStore('objectives', 'objectives', {})(connect);
	window.store = connect;
}

export const observe = createObserve(connect);
export default connect;