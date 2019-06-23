import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withHandlers } from 'recompact'
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
import { Card } from '../../shared/methods'
import { go, state, history } from '../utils/router'

const setSearch = search => go(history.get(), { search })
const debouncedSetSearch = _.debounce(setSearch, 300)

const withCampaignSearch = withTracker(() => ({
	search: (state.get() || {}).search,
	setSearch: debouncedSetSearch,
}))

const withCreateCardSearchAction = withHandlers({
	searchAction: ({ search, setSearch, campaign }) => async () => {
		const { _id } = await Card.create({
			title: search,
			campaignId: campaign._id,
		})
		setSearch('')
		go(`/${campaign._id}/${_id}`)
	},
})

const connectCampaignPage = compose(
	withCampaignData,
	withCampaignSearch,
	withCreateCardSearchAction,
)

export default connectCampaignPage(
	({ campaign, search, setSearch, searchAction }) => (
		<>
			<Title>{campaign.title}</Title>

			<CampaignSplash />

			<SplashToolbar>
				<Center>
					<Search
						initialValue={search}
						searchAction={searchAction}
						onChange={setSearch}
					/>

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
