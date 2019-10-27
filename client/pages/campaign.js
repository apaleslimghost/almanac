import React, { useEffect, useState } from 'react'
import { useTracker } from 'meteor/quarterto:hooks'
import _ from 'lodash'

import { useCampaign } from '../data/campaign'
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

export default () => {
	const campaign = useCampaign()
	const { search } = useTracker(() => state.get() || {})
	const [_search, _setSearch] = useState('')

	function setSearch(search) {
		_setSearch(search)
		debouncedSetSearch(search)
	}

	useEffect(() => {
		_setSearch(search)
	}, [search])

	async function searchAction() {
		const { _id } = await Card.create({
			title: search,
			campaignId: campaign._id,
		})
		setSearch('')
		go(`/${campaign._id}/${_id}`)
	}

	return (
		<>
			<Title>{campaign.title}</Title>

			<CampaignSplash />

			<SplashToolbar>
				<Center>
					<Search
						value={_search}
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
	)
}
