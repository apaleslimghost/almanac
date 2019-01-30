import React from 'react'
import { compose, withState, withHandlers } from 'recompact'
import Shortcut from '../visual/shortcut'
import { Input } from '../visual/form'
import { Card } from '../../shared/methods'
import { go } from '../utils/router'
import { withCampaignId } from '../data/campaign'

import { MenuItem, MenuButton } from '../visual/menu'

const withSearchState = withState('search', 'setSearch', '')
const withCreateSearchAction = withHandlers({
	searchAction: ({ search, onChange, campaignId }) => async () => {
		const { _id } = await Card.create({ title: search, campaignId })
		onChange('')
		go(`/${campaignId}/${_id}`)
	}
})

const withKeydownHandler = withHandlers({
	keydown: ({ searchAction }) => event => {
		// ⌘↩︎ or Ctrl+Enter
		if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
			searchAction()
		}
	}
})

const connectSearch = compose(
	withCampaignId,
	withSearchState,
	withCreateSearchAction,
	withKeydownHandler
)

const Search = connectSearch(
	({ search, setSearch, onChange, searchAction, keydown }) => (
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
				<MenuButton onClick={searchAction}>
					<Shortcut>
						{navigator.platform === 'MacIntel' ? '⌘↩︎' : 'Ctrl + Enter'}
					</Shortcut>
					Quick add
				</MenuButton>
			)}
		</>
	)
)

export default Search
