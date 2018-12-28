import React from 'react'
import { compose } from 'recompact'

import withCards from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'

const withPageCard = withCards(
	'card',
	({ cardId }) => ({ _id: cardId }),
	{ single: true }
)

const withCardData = compose(
	withCampaignId,
	withPageCard,
	withLoading
)

export default withCardData(({ card }) => <>
	{card.title}
</>)