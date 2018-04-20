import {withCampaignSession} from '../../../data/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose} from 'recompose';
import OdreianDate from 'dream-date/calendar/odreian';

const withTime = withTracker(({campaignSession}) => ({
	date: new OdreianDate(campaignSession.get('date') || 0),
}));

export default compose(withCampaignSession, withTime);
