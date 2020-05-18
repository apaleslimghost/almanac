import React from 'react'
import rpgIcons from '@apaleslimghost/rpg-awesome-list'

const Icon = ({ icon, className = '' }) => {
	const prefix = rpgIcons.has(icon) ? 'ra' : 'fa'

	return <i className={`${prefix} ${prefix}-${icon} ${className}`} />
}

export default Icon
