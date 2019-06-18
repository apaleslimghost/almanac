import React from 'react'
import { compose } from 'recompact'

import { withCampaignSession } from '../data/campaign'
import ShowCard from '../document/card'
import { FlexGrid } from '../visual/grid'
import withCardSearch from '../data/card-search'

const connectCardList = compose(
	withCampaignSession,
	withCardSearch,
)

const CardList = connectCardList(({ cards, ready }) => (
	<FlexGrid>
		{ready
			? cards.map(card => <ShowCard key={card._id} card={card} />)
			: Array.from({ length: 20 }, (_, i) => (
					<ShowCard
						key={i}
						card={{
							title: ' ', // careful, this is a nonbreaking space
							text: Math.random() > 0.5 ? ' ' : '',
							cover: Math.random() > 0.5 ? { from: 'mock' } : '',
						}}
					/>
			  ))}
	</FlexGrid>
))

export default CardList
