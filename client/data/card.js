import {withTracker} from 'meteor/react-meteor-data';
import {Cards} from '../../../shared/collections';

export default (key, query = {}) => withTracker(({campaignId, ...props}) => ({
	[key]: Cards.find(
		Object.assign(
			{campaignId},
			typeof query === 'function' ? query(props) : query
		)
	).fetch()
}));
