import publish from './publish';
import {Cards, Types, CardLinks} from '../src/collections';

const join => (collection, cursor) => [cursor, ...collection.getCursorJoins(cursor)];
const findJoined = (collection, ...args) => join(collection, collection.find(...args));

publish({
	cards: {
		all: () => Cards.find(),
		links: () => findJoined(CardsLinks)
	},
});
