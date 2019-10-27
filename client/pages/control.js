import React from 'react'
import BlockLayout from '../collection/block-layout'
import Icon from '../visual/icon'
import { useCampaign } from '../data/campaign'
import { useAssertAmOwner } from '../data/owner'
import { MenuLink } from '../visual/menu'
import { useExtraNavItems } from './layout'

const LaunchLink = () => {
	const campaign = useCampaign()

	function launchDashboard(ev) {
		ev.preventDefault()

		const dashboardWindow = window.open(
			`/${campaign._id}/dashboard`,
			campaign._id,
			'width=600,height=400',
		)

		dashboardWindow.document.body.addEventListener('click', () => {
			dashboardWindow.document.body.requestFullscreen()
		}, {once: true})
	}

	return (
	<MenuLink href={`/${campaign._id}/dashboard`} onClick={launchDashboard}>
		<Icon icon='scroll-unfurled' />
		Launch Dashboard
	</MenuLink>
	)
}

export default props => {
	const campaign = useCampaign()
	useAssertAmOwner(campaign)
	useExtraNavItems(<LaunchLink />)

	return <BlockLayout which='control' {...props} />
}
