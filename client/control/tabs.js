import React from 'react'
import { withState } from 'recompact'
import preventingDefault from '../utils/preventing-default';

const connectTabs = withState(
	'tab',
	'setTab',
	({ children }) => Object.keys(children)[0]
)

export default connectTabs(({ tab, setTab, children }) => <div>
	{Object.keys(children).map(
		t => <button
			key={t}
			disabled={t === tab}
			onClick={preventingDefault(() => setTab(t))}
		>{t}</button>
	)}
	{children[tab]}
</div>)