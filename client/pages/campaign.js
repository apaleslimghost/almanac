import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { compose, withHandlers } from 'recompact'
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
import { Card } from '../../shared/methods'
import { go } from '../utils/router'

const searchVar = new ReactiveVar('')
const debouncedSetSearch = _.debounce(searchVar.set.bind(searchVar), 300)

const withCampaignSearch = withTracker(() => ({
	search: searchVar.get(),
	setSearch: debouncedSetSearch
}))

const withCreateCardSearchAction = withHandlers({
	searchAction: ({ search, setSearch, campaign }) => async () => {
		const { _id } = await Card.create({
			title: search,
			campaignId: campaign._id
		})
		setSearch('')
		go(`/${campaign._id}/${_id}`)
	}
})

const connectCampaignPage = compose(
	withCampaignData,
	withCampaignSearch,
	withCreateCardSearchAction
)

export default connectCampaignPage(
	({ campaign, search, setSearch, searchAction }) => (
		<>
			<Title>{campaign.title}</Title>

			<CampaignSplash />

			<SplashToolbar>
				<Center>
					<Search
						searchAction={searchAction}
						actionLabel='Quick add'
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
	)
)
