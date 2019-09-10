import qs from 'querystring'
import { withTracker } from 'meteor/react-meteor-data'
import styled, { css } from 'styled-components'
import { compose, getContext, withHandlers, withState } from 'recompact'
import React from 'react'

import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections'
import { FlexGrid } from '../visual/grid'
import preventingDefault from '../utils/preventing-default'
import { unsplashDownload } from '../../shared/methods'

import { Button, List } from '../visual/primitives'
import Icon from '../visual/icon'
import Tabs from './tabs'
import Modal from './modal'
import { fieldLike } from './form'
import withLoading from './loading'

const withSearch = withState('query', 'setQuery', '')

const withUnsplashSearch = withTracker(({ query }) => ({
	ready: query ? subscribe(['unsplash.search', query]) : false,
	photos: UnsplashPhotos.find({ fromSearch: query }).fetch(),
}))

const withAlmanacCollection = withTracker(() => ({
	ready: subscribe(['unsplash.getCollectionPhotos', '2021417']),
	photos: UnsplashPhotos.find({ fromCollection: '2021417' }).fetch(),
}))

const withFieldContext = getContext(fieldLike)

const withImageSelectActions = withHandlers({
	setImage: ({ setFields, name }) => image => {
		setFields({
			[name]: image,
		})

		if (image) {
			unsplashDownload(image.id)
		}
	},
})

const connectImageSelect = compose(
	withFieldContext,
	withImageSelectActions,
)

const connectSearch = compose(
	withSearch,
	withUnsplashSearch,
)

const connectCollection = compose(
	withAlmanacCollection,
	withLoading,
)

const FlexImg = styled.img`
	width: 100%;
	height: auto;
	display: block;
`

const ImgSelect = styled.button.attrs({ type: 'button' })`
	border: 0 none;
	background: none;
	padding: 0;

	${({ selected }) =>
		selected &&
		css`
			outline: 5px solid blue;
		`};
`

const getThumb = ({ urls }, { w = 450, h = 150 } = {}) =>
	urls.raw +
	'&' +
	qs.stringify({
		fit: 'crop',
		crop: 'entropy',
		w,
		h,
	})

const ImageSelectSection = ({ photos, setImage, fields, name }) => (
	<FlexGrid small>
		{photos.map(photo => (
			<ImgSelect
				key={photo.id}
				selected={fields[name] === photo.id}
				onClick={preventingDefault(() =>
					setImage({ from: 'unsplash', id: photo.id }),
				)}
			>
				<FlexImg
					width={450}
					height={150}
					src={getThumb(photo)}
					alt={photo.description}
				/>
			</ImgSelect>
		))}
	</FlexGrid>
)

const SearchImage = connectSearch(({ query, setQuery, ready, ...props }) => (
	<>
		<input
			type='search'
			value={query}
			onChange={ev => setQuery(ev.target.value)}
		/>
		{query && (ready ? <ImageSelectSection {...props} /> : 'loading...')}
	</>
))

const CollectionImage = connectCollection(ImageSelectSection)

const ImageSelectTabs = props => (
	<Tabs>
		{{
			Suggested: <CollectionImage {...props} />,
			Search: <SearchImage {...props} />,
		}}
	</Tabs>
)

export default connectImageSelect(ImageSelectTabs)

export const ImageSelectModal = connectImageSelect(
	({ setImage, fields, name }) => (
		<Modal
			control={props =>
				fields[name] ? (
					<List>
						<Button type='button' {...props}>
							<Icon icon='edit' /> Edit image
						</Button>
						<Button
							type='button'
							colour='scarlet'
							onClick={() => setImage(null)}
						>
							<Icon icon='remove' /> Remove image
						</Button>
					</List>
				) : (
					<Button type='button' {...props}>
						<Icon icon='image' /> Set image
					</Button>
				)
			}
			render={({ close }) => (
				<ImageSelectTabs
					{...{ fields, name }}
					setImage={img => {
						setImage(img)
						close()
					}}
				/>
			)}
		/>
	),
)
