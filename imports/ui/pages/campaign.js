import React, { useEffect, useState } from 'react'
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
import { Card } from '../../lib/methods'
import { navigate as go, useCurrentUrl } from 'use-history'

export default () => {
	let { url, state } = useCurrentUrl()
	state = state || {} // ugh

	const debouncedSetSearch = _.debounce(search => go(url, { search }), 300)

	const campaign = useCampaign()
	const [_search, _setSearch] = useState('')

	function setSearch(search) {
		_setSearch(search)
		debouncedSetSearch(search)
	}

	useEffect(() => {
		_setSearch(state.search)
	}, [state.search])

	async function searchAction() {
		const { _id } = await Card.create({
			title: state.search,
			campaignId: campaign._id,
		})
		setSearch('')
		go(`/${campaign._id}/${_id}`)
	}

	return campaign ? (
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
				<CardList search={state.search} />
			</Main>
			<Aside>
				<HistoryList />
			</Aside>
		</>
	) : null
}
