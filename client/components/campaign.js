import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {compose} from 'recompose';
import getCampaignSession from '../../shared/session';

export const campaignContext = {
	campaignId: PropTypes.string,
};

export const withCampaign = Child => {
	const Wrapped = (props, {campaignId}) => <Child {...props} campaignId={campaignId} />;
	Wrapped.contextTypes = campaignContext;
	return Wrapped;
};

export const setsCampaign = Child => class Wrapped extends Component {
	static childContextTypes = {
		campaignId: PropTypes.string,
	};

	getChildContext() {
		return {
			campaignId: this.props.campaignId,
		};
	}

	render() {
		const {campaignId, ...props} = this.props;
		return <Child {...props} />;
	}
};

export const withCampaignSession = compose(
	Child => ({campaignId, ...props}) => (
		<Child {...props} campaignSession={getCampaignSession(campaignId)} />
	),
	withCampaign
);
