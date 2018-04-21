import React from 'react';
import {withCampaignData} from '../data/campaign';

export default withCampaignData(({campaign}) => <div>
	{campaign.title}
</div>);
