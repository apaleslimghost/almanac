import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withState, withHandlers } from 'recompact'
import { ReactiveVar } from 'meteor/reactive-var'
import _ from 'lodash'

import { withCampaignData, withCampaignId } from '../data/campaign'
import { CampaignSplash } from '../visual/splash'
import Title from '../utils/title'
import CardList from '../collection/card-list'

import {
	SplashToolbar,
	MenuItem,
	MenuLink,
	Space,
	Center,
	MenuButton
} from '../visual/menu'
import Icon from '../visual/icon'
import { Input } from '../visual/form'
import HistoryList from '../collection/card-history'
import { Main, Aside } from '../visual/grid'
import { Card } from '../../shared/methods'
import { go } from '../utils/router'

const searchVar = new ReactiveVar('')
const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withCampaignSearch = withTracker(() => ({
	search: searchVar.get(),
	setSearch: debouncedSetSearch
}))

const withSearchState = withState('search', 'setSearch', '')
const withSearchActions = withHandlers({
	createCard: ({ search, campaignId }) => async ev => {
		const { _id } = await Card.create({ title: search, campaignId })
		go(`/${campaignId}/${_id}`)
	}
})

const connectSearch = compose(
	withCampaignId,
	withSearchState,
	withSearchActions
)

const Search = connectSearch(({ search, setSearch, onChange, createCard }) => (
	<>
		<MenuItem flush>
		<Input
			type='search'
			placeholder='Search&hellip;'
			value={search}
			onChange={ev => {
				setSearch(ev.target.value)
				onChange(ev.target.value)
			}}
		/>
		</MenuItem>
		{search && (
			<MenuButton onClick={createCard}>
				<Icon icon='plus' />
				Quick add&hellip;
			</MenuButton>
		)}
	</>
))

const connectCampaignPage = compose(
	withCampaignData,
	withCampaignSearch
)

export default connectCampaignPage(({ campaign, search, setSearch }) => (
	<>
		<Title>{campaign.title}</Title>

		<CampaignSplash />

		<SplashToolbar>
			<Center>
					<Search onChange={setSearch} />

				<Space />

				<MenuLink href={`/${campaign._id}/new`}>
					<Icon icon='file-text-o' /> New
				</MenuLink>
			</Center>
		</SplashToolbar>

		<Main left>
			<CardList search={search} />
		</Main>
		<Aside>
			<HistoryList />
		</Aside>
	</>
))
