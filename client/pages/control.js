import React, {Component} from 'react';
import Group from '../group';
import PropTypes from 'prop-types';
import {MenuLink} from './layout';
import Icon from '../components/icon';
import {campaignContext} from '../components/campaign';

export default class DashboardControl extends Component {
	static contextTypes = {
		...campaignContext,
		setNavItems: PropTypes.func
	}

	render() {
		return <Group which='control' />;
	}

	launchDashboard = (ev) => {
		ev.preventDefault();

		window.open(
			`/${this.context.campaignId}/dashboard`,
			this.context.campaignId,
			'width=600,height=400'
		);
	};

	componentDidMount() {
		this.context.setNavItems(
			<MenuLink
				href={`/${this.context.campaignId}/dashboard`}
				onClick={this.launchDashboard}
				key='launch'
			>
				<Icon icon='scroll-unfurled' />
				Launch Dashboard
			</MenuLink>
		);
	}
}
