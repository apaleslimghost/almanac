import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { compose } from 'recompact'
import styled from 'styled-components'
import Markdown from '../document/markdown'
import withCards, { withCard } from '../data/card'
import { withCampaignId } from '../data/campaign'
import withLoading from '../control/loading'
import { SplashBleed, Hero, HeroTitle } from '../visual/splash'
import ShowCard from '../document/card'
import { canEdit as canEditCard } from '../../shared/utils/validators/card'
import { withUserData } from '../utils/logged-in'
import Icon from '../visual/icon'
import Title from '../utils/title'
import schema from '../../shared/schema'
import { Owner } from '../document/user'
import {
	SplashToolbar,
	MenuItem,
	MenuLink,
	Space,
	Divider,
	Center,
} from '../visual/menu'
import withImage from '../data/image'
import { CardHistoryList } from '../collection/card-history'
import Search from '../collection/card-search'
import withCardSearch from '../data/card-search'
import { addRelated, Card } from '../../shared/methods'
import _ from 'lodash'
import { ReactiveVar } from 'meteor/reactive-var'
import { withHandlers } from 'recompact'

const withRelatedCards = withCards('relatedCards', ({ card }) => ({
	_id: { $in: (card && card.related) || [] },
}))

const withCardData = compose(
	withCampaignId,
	withCard,
	withRelatedCards,
	withUserData,
	withLoading,
)

const connectCardSplash = withImage(({ card }) => card.cover)

export const CardSplash = connectCardSplash(({ card, ...props }) => (
	<SplashBleed small {...props}>
		<Hero>
			<HeroTitle>{card.title}</HeroTitle>
		</Hero>
	</SplashBleed>
))

const CardBody = styled.article`
	grid-column: main-left;
`

const Right = styled.aside`
	grid-column: right;
`

const SearchWrapper = styled.div`
	display: flex;
	position: relative;
`

const searchVar = new ReactiveVar('')
const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withCampaignSearch = withTracker(() => ({
	search: searchVar.get(),
	setSearch: debouncedSetSearch,
}))

const withAddRelatedSearchAction = withHandlers({
	searchAction: ({ search, setSearch, campaignId, card }) => async ({
		setSearch: setSearchInput,
	}) => {
		const relatedCard = await Card.create({
			title: search,
			campaignId,
		})

		setSearch('')
		setSearchInput('')
		addRelated(card, relatedCard)
	},
})

const connectSearchContainer = compose(
	withCampaignId,
	withCampaignSearch,
	withCardSearch,
	withAddRelatedSearchAction,
)

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 1rem;
	background: white;
	z-index: 1;
`

const SearchContainer = connectSearchContainer(
	({ cards, search, setSearch, searchAction, ready }) => (
		<SearchWrapper>
			<Search
				right
				placeholder='Add related&hellip;'
				searchAction={searchAction}
				onChange={setSearch}
			/>
			{console.log({ search, ready })}
			{search && ready && (
				<Dropdown>
					<ul>
						{cards.slice(0, 10).map(card => (
							<li key={card._id}>{card.title}</li>
						))}
					</ul>
				</Dropdown>
			)}
		</SearchWrapper>
	),
)

export default withCardData(({ card, relatedCards, user }) => (
	<>
		<CardSplash card={card} />
		<Title>{card.title}</Title>

		<SplashToolbar>
			<Center>
				{card.type && (
					<>
						<MenuItem>{schema[card.type].name}</MenuItem>
						<Divider />
					</>
				)}

				{card.type && (
					<>
						{_.map(
							schema[card.type].fields,
							({ label, format = a => a }, key) => (
								<MenuItem key={key}>
									<b>{label} </b>
									{format(card[key])}
								</MenuItem>
							),
						)}
						<Divider />
					</>
				)}

				<MenuItem>
					<Owner of={card} />
				</MenuItem>

				{canEditCard(card, user._id) && (
					<>
						<MenuLink href={`/${card.campaignId}/${card._id}/edit`}>
							<Icon icon='edit' />
							Edit
						</MenuLink>

						<Space />
						<SearchContainer card={card} />
					</>
				)}
			</Center>
		</SplashToolbar>

		<CardBody>
			<Markdown source={card.text || ''} />
		</CardBody>

		<Right>
			{relatedCards.length > 0 &&
				relatedCards.map(related => (
					<ShowCard key={related._id} card={related} />
				))}

			<CardHistoryList card={card} />
		</Right>
	</>
))
