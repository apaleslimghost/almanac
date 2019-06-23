import React, { Children } from 'react'
import Shortcut from '../visual/shortcut'
import { Input } from '../visual/form'

import { MenuItem, MenuButton } from '../visual/menu'

const createCtrlEnterHandler = action => event => {
	// ⌘↩︎ or Ctrl+Enter
	if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
		action()
	}
}

const MaybeBackwardsFragment = ({ reverse, children }) => (
	<>{reverse ? Children.toArray(children).reverse() : children}</>
)

const Search = ({
	value,
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
				value={value || ''}
				onChange={ev => {
					if (onChange) {
						onChange(ev.target.value)
					}
				}}
				onKeyDown={searchAction && createCtrlEnterHandler(searchAction)}
				{...props}
			/>
		</MenuItem>
		{value && searchAction && (
			<MenuButton onClick={searchAction}>
				<Shortcut>
					{navigator.platform === 'MacIntel' ? '⌘↩︎' : 'Ctrl + Enter'}
				</Shortcut>
				{actionLabel || 'Quick add'}
			</MenuButton>
		)}
	</MaybeBackwardsFragment>
)

export default Search
