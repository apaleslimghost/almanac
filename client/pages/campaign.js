import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose } from 'recompact'
import { ReactiveVar } from 'meteor/reactive-var'
import _ from 'lodash'

import { withCampaignData } from '../data/campaign'
import { CampaignSplash } from '../visual/splash'
import Title from '../utils/title'
import CardList from '../collection/card-list'
import { SplashToolbar, MenuLink, Space, Center } from '../visual/menu'
import Icon from '../visual/icon'
import Search from '../collection/card-search'
import HistoryList from '../collection/card-history'
import { Main, Aside } from '../visual/grid'

const searchVar = new ReactiveVar('')
const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withCampaignSearch = withTracker(() => ({
	search: searchVar.get(),
	setSearch: debouncedSetSearch
}))

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
