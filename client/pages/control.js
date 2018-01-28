import React, {Component} from 'react';
import BlockLayout from '../components/collection/block-layout';
import PropTypes from 'prop-types';
import {MenuLink} from './layout';
import Icon from '../components/visual/icon';
import {campaignContext} from '../components/data/campaign';

export default class DashboardControl extends Component {
	static contextTypes = {
		...campaignContext,
		setNavItems: PropTypes.func
	}

	render() {
		return <BlockLayout which='control' />;
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

	componentWillUnmount() {
		this.context.setNavItems();
	}
}
