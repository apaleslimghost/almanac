import React from 'react'
import { Link } from 'use-history'

import * as form from './form.mdx'
import * as logo from './logo.mdx'

const pages = { form, logo }

export default ({ page }) => {
	if (!pages.hasOwnProperty(page)) {
		throw new Error(`Docs page ${page} not found`)
	}

	const { default: Page, title } = pages[page]

	return (
		<>
			<h1>{title}</h1>

			<ul>
				{Object.keys(pages).map(page => (
					<li key={page}>
						<Link href={`/__docs/${page}`}>{pages[page].title}</Link>
					</li>
				))}
			</ul>
			<Page />
		</>
	)
}
