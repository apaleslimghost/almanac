import React from 'react';
import getCampaignSession from '../../shared/session';
import PropTypes from 'prop-types';
import {withTracker} from 'meteor/react-meteor-data';
import {Campaigns} from '../../shared/collections';
import subscribe from '../utils/subscribe';
import withLoading from '../control/loading';
import {NotFound} from 'http-errors';
import {
	compose,
	withProps,
	withContext,
	getContext
} from 'recompact';

export const campaignExists = withTracker(({campaignId}) => {
	const ready = subscribe('campaigns.all');
	const campaign = Campaigns.findOne(campaignId);

	if(campaignId && ready && !campaign) {
		throw new NotFound(`Campaign ${campaignId} not found`);
	}

	return {ready, campaignId};
});

export const campaignContext = {
	campaignId: PropTypes.string,
};

export const withCampaign = getContext(campaignContext);

export const setsCampaignContext = withContext(
	campaignContext,
	props => ({campaignId: props.campaignId}),
);

export const setsCampaign = compose(
	campaignExists,
	withLoading,
	setsCampaignContext
);

const setCampaignSession = withProps(({campaignId}) => ({
	campaignSession: getCampaignSession(campaignId),
}));

export const withCampaignSession = compose(
	withCampaign,
	setCampaignSession
);
