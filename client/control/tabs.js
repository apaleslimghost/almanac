import React from 'react'
import { withState } from 'recompact'
import styled, { css } from 'styled-components'

import preventingDefault from '../utils/preventing-default';

const connectTabs = withState(
	'tab',
	'setTab',
	({ children }) => Object.keys(children)[0]
)

const TabBar = styled.div`
	border-bottom: 1px solid black;
	margin: 0.5em 0;
`

const Tab = styled.button`
	padding: 0.5em 1em;
	border: 0 none;
	${({ selected }) => selected && css`
		box-shadow: inset 0 -2px 0 black;
	`}
	background: none;
	font: inherit;
`

export default connectTabs(({ tab, setTab, children }) => <div>
	<TabBar>
		{Object.keys(children).map(
			t => <Tab
				key={t}
				selected={t === tab}
				onClick={preventingDefault(() => setTab(t))}
			>{t}</Tab>
		)}
	</TabBar>
	{children[tab]}
</div>)