import React from 'react'
import Logo from '../imports/ui/visual/logo'
import { withKnobs, boolean } from '@storybook/addon-knobs'

export default {
	title: 'Logo',
	decorators: [withKnobs],
}

export const logo = () => <Logo large={boolean('Large', false)} />
