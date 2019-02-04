import React from 'react'
import { withState } from 'recompact'
import Shortcut from '../visual/shortcut'
import { Input } from '../visual/form'

import { MenuItem, MenuButton } from '../visual/menu'

const withSearchState = withState('search', 'setSearch', '')

const createCtrlEnterHandler = action => event => {
	// ⌘↩︎ or Ctrl+Enter
	if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
		action()
	}
}

const Search = withSearchState(
	({ search, setSearch, onChange, searchAction, actionLabel }) => (
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
					onKeyDown={createCtrlEnterHandler(searchAction)}
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
