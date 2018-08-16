import {withTracker} from 'meteor/react-meteor-data';
import {Cards} from '../../shared/collections';
import subscribe from '../utils/subscribe';

export default (key, query = {}) => withTracker(({campaignId, ...props}) => ({
	ready: subscribe('cards.all'),
	[key]: Cards.find(
		Object.assign(
			{campaignId},
			typeof query === 'function' ? query(props) : query
		)
	).fetch()
}));
