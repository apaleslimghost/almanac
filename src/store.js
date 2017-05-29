import createStore from 'enviante';
import localStore from '@quarterto/enviante-localstorage';
import jsonbinStore from './jsonbin';
import createObserve from 'enviante-react';

const remotePath = key => `quarterto/almanac/${key}`;

const state = {
	date: 48864384000,
	layout: ['placeholder'],
	objectives: {},
	weather: {
		humidity: 50,
		temperature: 15,
		windSpeed: 10,
		windHeading: 0,
	},
};

const stateStores = key => [
	jsonbinStore(remotePath(key), key, state[key]),
	process.browser && localStore(key, key, state[key]),
].map(e => e && e(connect));

const connect = createStore(state, {noRemote: true, noLocal: true});

connect(({subscribe}) => {
	const err = subscribe('_error');
	if(err) {
		console.error(err);
	}
});

Object.keys(state).map(stateStores);

if(process.browser) {
	window.store = connect;
}

export const observe = createObserve(connect);
export default connect;
