import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withState, withHandlers } from 'recompact'
import { ReactiveVar } from 'meteor/reactive-var'
import _ from 'lodash'

import styled from 'styled-components'
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
const withCreateCardHandler = withHandlers({
	createCard: ({ search, onChange, campaignId }) => async () => {
		const { _id } = await Card.create({ title: search, campaignId })
		onChange('')
		go(`/${campaignId}/${_id}`)
	}
})

const withKeydownHandler = withHandlers({
	keydown: ({ createCard }) => event => {
		// ⌘↩︎ or Ctrl+Enter
		if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
			createCard()
		}
	}
})

const connectSearch = compose(
	withCampaignId,
	withSearchState,
	withCreateCardHandler,
	withKeydownHandler
)

const Shortcut = styled.span`
	font-size: 0.7em;
	opacity: 0.5;
	border-width: 1px;
	border-style: solid;
	border-radius: 2px;
	padding: 0.25em;
	margin-right: 0.5em;
`

const Search = connectSearch(
	({ search, setSearch, onChange, createCard, keydown }) => (
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
					onKeyDown={keydown}
				/>
			</MenuItem>
			{search && (
				<MenuButton onClick={createCard}>
					<Shortcut>
						{navigator.platform === 'MacIntel' ? '⌘↩︎' : 'Ctrl + Enter'}
					</Shortcut>
					Quick add
				</MenuButton>
			)}
		</>
	)
)

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
