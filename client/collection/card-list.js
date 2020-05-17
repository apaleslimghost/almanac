import React from 'react'

import ShowCard from '../document/card'
import { FlexGrid } from '../visual/grid'
import { useCardSearch } from '../data/card-search'

const CardList = ({ search }) => {
	const { cards, ready } = useCardSearch({ search })

	return (
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
	)
}

export default CardList
