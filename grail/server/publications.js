import publish from './publish';
import {Cards} from '../src/collections';

publish({
	cards: {
		all: () => Cards.find(),
	},});
