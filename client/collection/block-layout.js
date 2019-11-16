import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import {
	default as GridLayout,
	WidthProvider as widthProvider,
} from 'react-grid-layout'
import { Layouts } from '../../shared/collections'
import * as blocks from '../blocks'
import subscribe from '../utils/subscribe'
import { Layout } from '../../shared/methods'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useCampaignId } from '../data/campaign'
import { useTracker } from 'meteor/quarterto:hooks'

const ReactGrid = createGlobalStyle`
	.react-grid-item {
		overflow: auto;
	}

	.grid-control .react-grid-item {
		border: 1px solid #e9e1da;
		background: #f9f1ea;
	}

	.react-grid-item.react-grid-placeholder {
		background: teal;
	}

	.react-resizable-handle {
		z-index: 100;
	}
`

const GridLayoutWidth = widthProvider(GridLayout)

const ComponentSelect = ({ onSelect }) => {
	const [selected, select] = useState('')

	return (
		<>
			<ReactGrid />
			<select
				value={selected}
				onChange={ev => select(ev.target.selectedOptions[0].value)}
			>
				<option disabled value=''>
					Component&hellip;
				</option>
				{Object.keys(blocks).map(component => (
					<option key={component} value={component}>
						{component}
					</option>
				))}
			</select>
			<button
				type='button'
				disabled={!selected}
				onClick={() => {
					onSelect(selected)
					select('')
				}}
			>
				+
			</button>
		</>
	)
}

const CloseButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1000;
`

const Bleed = styled.div`
	grid-column: bleed;
`

export default ({ which, ...props }) => {
	const campaignId = useCampaignId()
	const layout = useTracker(() => {
		subscribe('layout.all')
		return Layouts.find({ campaignId }).fetch()
	}, [campaignId])

	function updateLayout(layout) {
		layout.forEach(({ i, ...item }) => {
			Layout.update({ _id: i }, item)
		})
	}

	function addComponent(component) {
		Layout.create({ component, x: 0, y: 0, w: 2, h: 1, campaignId })
	}

	function removeComponent(layout) {
		Layout.delete(layout)
	}

	return (
		<Bleed className={`grid-${which}`}>
			{which === 'control' && <ComponentSelect onSelect={addComponent} />}
			<GridLayoutWidth
				layout={layout.map(({ _id, ...item }) => ({ i: _id, ...item }))}
				isDraggable={which === 'control'}
				isResizable={which === 'control'}
				rowHeight={60}
				draggableCancel='input, button, select'
				{...(which === 'control' ? { onLayoutChange: updateLayout } : {})}
			>
				{layout.map(item => (
					<div key={item._id}>
						{which === 'control' && (
							<CloseButton onClick={() => removeComponent(item)}>×</CloseButton>
						)}
						{blocks[item.component]
							? React.createElement(blocks[item.component][which], props)
							: 'unknown component'}
					</div>
				))}
			</GridLayoutWidth>
		</Bleed>
	)
}
