import {withCampaignSession} from '../../../components/campaign';
import {withTracker} from 'meteor/react-meteor-data';
import {compose} from 'recompose';
import OdreianDate from 'odreian-date'

const withTime = withTracker(({campaignSession}) => ({
	date: new OdreianDate(campaignSession.get('date') || 0),
}));

export default compose(withCampaignSession, withTime);
