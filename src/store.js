import createStore from 'enviante';
import localStore from '@quarterto/enviante-localstorage';
import {createObserve} from 'enviante-react';

const connect = createStore({
	date: 48864384000
});

if(typeof localStorage !== 'undefined') {
	localStore('date', 'date')(connect);
}

export const observe = createObserve(connect);
export default connect;