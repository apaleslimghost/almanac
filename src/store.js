import createStore from 'enviante';
import localStore from '@quarterto/enviante-localstorage';
import jsonbinStore from './jsonbin';
import createObserve from 'enviante-react';

const connect = createStore({
	date: 48864384000,
	layout: ['placeholder'],
	objectives: {},
}, {noRemote: true, noLocal: true});

connect(({subscribe}) => {
	const err = subscribe('_error');
	if(err) {
		console.error(err);
	}
});

[
	jsonbinStore('quarterto/almanac/date', 'date', 48864384001),
	jsonbinStore('quarterto/almanac/objectives', 'objectives', {}),
	jsonbinStore('quarterto/almanac/layout', 'layout', ['placeholder']),
].map(j => j(connect));

if(typeof localStorage !== 'undefined') {
	[
		localStore('date', 'date', 48864384002, {noInitial: true}),
		localStore('objectives', 'objectives', {}, {noInitial: true}),
		localStore('layout', 'layout', [], {noInitial: true}),
	].map(local => local(connect));

	window.store = connect;
}

export const observe = createObserve(connect);
export default connect;
