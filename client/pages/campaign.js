import React from 'react'
import { withCampaignData } from '../data/campaign'
import { CampaignSplash } from '../visual/splash'
import Title from '../utils/title'
import CardList from '../collection/card-list'

export default withCampaignData(({ campaign }) => (
	<>
		<Title>{campaign.title}</Title>

		<CampaignSplash />
		<CardList />
	</>
))
