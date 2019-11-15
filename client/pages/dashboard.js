import React from 'react'
import BlockLayout from '../collection/block-layout'
import { useCampaign } from '../data/campaign'
import { useAmOwner } from '../data/owner'
import { useHidesNav } from './layout'

export default props => {
	const campaign = useCampaign()
	const amOwner = useAmOwner(campaign)
	useHidesNav(amOwner)

	return <BlockLayout which='display' {...props} />
}
