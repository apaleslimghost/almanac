import createStore from 'enviante';
import localStore from '@quarterto/enviante-localstorage';
import {createObserve} from 'enviante-react';

const connect = createStore({
	date: 0
});

if(typeof localStorage !== 'undefined') {
	localStore('date', 'date', 0)(connect);
}

export const observe = createObserve(connect);
export default connect;