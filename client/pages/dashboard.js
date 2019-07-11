import React from 'react'
import BlockLayout from '../collection/block-layout'
import { withCampaignData } from '../data/campaign'
import { iAmOwner } from '../data/owner'
import { maybeHidesNav } from './layout'

const connectDashboard = compose(
	withCampaignData,
 	iAmOwner('campaign'),
 	maybeHidesNav(({ isOwner }) => isOwner)
)

export default connectDashboard(() => <BlockLayout which='display' />)
