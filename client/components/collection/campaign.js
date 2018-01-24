import React from 'react';
import getCampaignSession from '../../shared/session';
import PropTypes from 'prop-types';
import {
	compose,
	withProps,
	withContext,
	getContext
} from 'recompose';

export const campaignContext = {
	campaignId: PropTypes.string,
};

export const withCampaign = getContext(campaignContext);

export const setsCampaign = withContext(
	campaignContext,
	props => ({campaignId: props.campaignId}),
);

const setCampaignSession = withProps(({campaignId}) => ({
	campaignSession: getCampaignSession(campaignId),
}));

export const withCampaignSession = compose(
	withCampaign,
	setCampaignSession
);
