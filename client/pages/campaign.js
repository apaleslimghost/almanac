import React from 'react'
import {compose, withPropsOnChange} from 'recompact'
import {withCampaignData, withCampaignSession} from '../data/campaign'
import {CampaignSplash} from '../visual/splash'
import Title from '../utils/title'
import CardList from '../collection/card-list'

const setSelectedCard = withPropsOnChange(
	['selectCard'],
	({selectCard, campaignSession}) => {
		campaignSession.set('selectedCard', selectCard)
	}
)

const connectGrail = compose(
	withCampaignSession,
	setSelectedCard
)

const Grail = connectGrail(CardList)

export default withCampaignData(({campaign, selectCard}) => (
	<>
		<Title>{campaign.title}</Title>

		<CampaignSplash />
		<Grail selectCard={selectCard} />
	</>
))
