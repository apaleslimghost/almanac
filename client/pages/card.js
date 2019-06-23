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
import { withState } from 'recompact'
import { lifecycle } from 'recompact'
import { FlexGrid } from '../visual/grid'
import { Dropdown } from '../visual/primitives'

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

const withSearchState = withState('_search', '_setSearch', '')
const searchVar = new ReactiveVar('')
const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withCampaignSearch = withTracker(({ _setSearch }) => ({
	search: searchVar.get(),
	setSearch(search) {
		_setSearch(search)
		debouncedSetSearch(search)
	},
	containerRef: React.createRef(),
}))

const withAddRelatedSearchAction = withHandlers({
	searchAction: ({ search, setSearch, campaignId, card }) => async () => {
		const relatedCard = await Card.create({
			title: search,
			campaignId,
		})

		setSearch('')
		addRelated(card, relatedCard)
	},
})

const withDropdownState = withState('showDropdown', 'setShowDropdown', false)

const withOutsideEventHandler = lifecycle({
	componentDidMount() {
		document.body.addEventListener(
			'mousedown',
			(this.handler = event => {
				if (!this.props.containerRef.current.contains(event.target)) {
					this.props.setShowDropdown(false)
				}
			}),
		)
	},

	componentWillUnmount() {
		document.body.removeEventListener('mousedown', this.handler)
	},
})

const connectSearchContainer = compose(
	withCampaignId,
	withSearchState,
	withCampaignSearch,
	withCardSearch,
	withAddRelatedSearchAction,
	withDropdownState,
	withOutsideEventHandler,
)

const CardPreview = ({ card, onClick }) => (
	<li>
		<a href={`/${card.campaignId}/${card._id}`} onClick={onClick}>
			{card.title}
		</a>
	</li>
)

const SearchContainer = connectSearchContainer(
	({
		card,
		cards,
		search,
		_search,
		setSearch,
		searchAction,
		ready,
		showDropdown,
		setShowDropdown,
		containerRef,
	}) => (
		<SearchWrapper innerRef={containerRef}>
			<Search
				right
				placeholder='Add related&hellip;'
				actionLabel='Create &amp; link'
				searchAction={searchAction}
				value={_search}
				onChange={setSearch}
				onFocus={() => setShowDropdown(true)}
			/>
			{_search && showDropdown && (
				<Dropdown>
					{ready && search && (
						<ul>
							{cards.map(related => (
								<CardPreview
									key={related._id}
									card={related}
									onClick={event => {
										event.preventDefault()
										addRelated(card, related)
										setSearch('')
									}}
								/>
							))}
						</ul>
					)}
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
			{relatedCards.length > 0 && (
				<FlexGrid>
					{relatedCards.map(related => (
						<ShowCard key={related._id} card={related} />
					))}
				</FlexGrid>
			)}

			<CardHistoryList card={card} />
		</Right>
	</>
))
