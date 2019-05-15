import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withState } from 'recompact'
import { ReactiveVar } from 'meteor/reactive-var'
import _ from 'lodash'

import { withCampaignData } from '../data/campaign'
import { CampaignSplash } from '../visual/splash'
import Title from '../utils/title'
import CardList from '../collection/card-list'

import {
	SplashToolbar,
	MenuItem,
	MenuLink,
	Space,
	Center,
} from '../visual/menu'
import Icon from '../visual/icon'
import { Input } from '../visual/form'
import HistoryList from '../collection/card-history'
import { Main, Aside } from '../visual/grid'

const searchVar = new ReactiveVar('')
const searchState = withState('_search', '_setSearch', '')

const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withSearch = compose(
	searchState,
	withTracker(({ _setSearch }) => ({
		search: searchVar.get(),
		setSearch(s) {
			debouncedSetSearch(s)
			_setSearch(s)
		},
	})),
)

const connectCampaignPage = compose(
	withCampaignData,
	withSearch,
)

export default connectCampaignPage(
	({ campaign, _search, search, setSearch }) => (
		<>
			<Title>{campaign.title}</Title>

			<CampaignSplash />

			<SplashToolbar>
				<Center>
					<MenuItem flush>
						<Input
							type='search'
							placeholder='Search&hellip;'
							value={_search}
							onChange={ev => setSearch(ev.target.value)}
						/>
					</MenuItem>

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
	),
)
