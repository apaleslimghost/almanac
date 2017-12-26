import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
	compose,
	withProps,
	withContext,
	getContext
} from 'recompose';
import getCampaignSession from '../../shared/session';

export const campaignContext = {
	campaignId: PropTypes.string,
};

export const withCampaign = getContext(campaignContext);

export const setsCampaign = withContext(
	campaignContext,
	({campaignId}) => ({campaignId})
);

const setCampaignSession = withProps(({campaignId}) => ({
	campaignSession: getCampaignSession(campaignId)
}));

export const withCampaignSession = compose(
	setCampaignSession,
	withCampaign
);
