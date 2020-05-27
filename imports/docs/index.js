import React from 'react'
import { Link } from 'use-history'
import Title from '../ui/utils/title'
import Logo from '../ui/visual/logo'
import { FullGrid, Main, Aside } from '../ui/visual/grid'

import * as form from './form.mdx'
import * as logo from './logo.mdx'

const pages = { form, logo }

export default ({ page }) => {
	if (!pages.hasOwnProperty(page)) {
		throw new Error(`Docs page ${page} not found`)
	}

	const { default: Page, title } = pages[page]

	return (
		<FullGrid>
			<Title titleTemplate='%s ❈ Almanac Docs'>{title}</Title>

			<Aside left>
				<Link href='/'>
					<Logo />
				</Link>
				<nav>
					<ul>
						{Object.keys(pages).map(page => (
							<li key={page}>
								<Link href={`/__docs/${page}`}>{pages[page].title}</Link>
							</li>
						))}
					</ul>
				</nav>
			</Aside>

			<Main right>
				<h1>{title}</h1>
				<Page />
			</Main>
		</FullGrid>
	)
}
