import publish from './publish';
import {Cards} from '../shared/collections';

publish({
	cards: {
		all: () => Cards.find(),
	},});
