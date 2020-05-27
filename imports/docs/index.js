import React from 'react'
import { Link } from 'use-history'
import Title from '../ui/utils/title'
import Logo from '../ui/visual/logo'
import { H1, H3 } from '../ui/visual/heading'
import { FullGrid, Main, Aside } from '../ui/visual/grid'
import { markdownComponents } from '../ui/document/markdown'
import { MDXProvider } from '@mdx-js/react'
import { groupBy } from 'lodash'

import * as index from './index.mdx'
import * as form from './form.mdx'
import * as logo from './logo.mdx'
import * as colours from './colours'

const pages = { index, form, logo, colours }

for (const page in pages) {
	pages[page].id = page
}

const categories = groupBy(pages, 'category')

export default ({ page }) => {
	if (!pages.hasOwnProperty(page)) {
		throw new Error(`Docs page ${page} not found`)
	}

	const { default: Page, title } = pages[page]
	const categories = groupBy(pages, 'category')

	return (
		<FullGrid>
			<Title titleTemplate='%s ❈ Almanac Docs'>{title}</Title>

			<Aside left>
				<Link href='/'>
					<Logo />
				</Link>
				<nav>
					{Object.keys(categories).map(category => (
						<>
							<H3>{category}</H3>
							<ul>
								{categories[category].map(page => (
									<li key={page.id}>
										<Link
											href={`/__docs/${page.id === 'index' ? '' : page.id}`}
										>
											{page.title}
										</Link>
									</li>
								))}
							</ul>
						</>
					))}
				</nav>
			</Aside>

			<Main right>
				<H1>{title}</H1>

				<MDXProvider components={markdownComponents}>
					<Page />
				</MDXProvider>
			</Main>
		</FullGrid>
	)
}
