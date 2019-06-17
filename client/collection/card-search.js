import React, { Children } from 'react'
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

const MaybeBackwardsFragment = ({ reverse, children }) => (
	<>{reverse ? Children.toArray(children).reverse() : children}</>
)

const Search = withSearchState(
	({
		search,
		setSearch,
		onChange,
		actionLabel,
		searchAction,
		placeholder = 'Search…',
		right = false,
		...props
	}) => (
		<MaybeBackwardsFragment reverse={right}>
			<MenuItem flush>
				<Input
					type='search'
					placeholder={placeholder}
					value={search}
					onChange={ev => {
						setSearch(ev.target.value)
						if (onChange) {
							onChange(ev.target.value)
						}
					}}
					onKeyDown={
						searchAction &&
						createCtrlEnterHandler(() => searchAction({ search, setSearch }))
					}
					{...props}
				/>
			</MenuItem>
			{search && searchAction && (
				<MenuButton onClick={() => searchAction({ search, setSearch })}>
					<Shortcut>
						{navigator.platform === 'MacIntel' ? '⌘↩︎' : 'Ctrl + Enter'}
					</Shortcut>
					{actionLabel || 'Quick add'}
				</MenuButton>
			)}
		</MaybeBackwardsFragment>
	),
)

export default Search
