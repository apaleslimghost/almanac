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
import withImage from '../data/image'
import Tabs from './tabs'
import Modal from './modal'
import { fieldLike } from './form'
import withLoading from './loading'

const withSearch = withState('query', 'setQuery', '')

const withUnsplashSearch = withTracker(({ query }) => ({
	ready: query ? subscribe(['unsplash.search', query]) : false,
	photos: UnsplashPhotos.find({ fromSearch: query }).fetch()
}))

const withAlmanacCollection = withTracker(() => ({
	ready: subscribe(['unsplash.getCollectionPhotos', '2021417']),
	photos: UnsplashPhotos.find({ fromCollection: '2021417' }).fetch()
}))

const withFieldContext = getContext(fieldLike)

const withImageSelectActions = withHandlers({
	setImage: ({ setFields, name }) => image => {
		setFields({
			[name]: image
		})

		unsplashDownload(image.id)
	}
})

const connectImageSelect = compose(
	withFieldContext,
	withImageSelectActions
)

const connectSearch = compose(
	withSearch,
	withUnsplashSearch
)

const connectCollection = compose(
	withAlmanacCollection,
	withLoading
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

const getThumb = ({ urls }) =>
	urls.raw +
	'&' +
	qs.stringify({
		fit: 'crop',
		crop: 'entropy',
		w: 450,
		h: 150
	})

const ImageSelectSection = ({ photos, setImage, fields, name }) => (
	<FlexGrid small>
		{photos.map(photo => (
			<ImgSelect
				key={photo.id}
				selected={fields[name] === photo.id}
				onClick={preventingDefault(() =>
					setImage({ from: 'unsplash', id: photo.id })
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
			Search: <SearchImage {...props} />
		}}
	</Tabs>
)

export default connectImageSelect(ImageSelectTabs)

const SelectedImage = withImage(({ id }) => id)(
	({ ready, image, ...props }) => (
		<ImgSelect {...props}>
			{ready && (
				<FlexImg
					width={450}
					height={150}
					src={getThumb(image)}
					alt={image.description}
				/>
			)}
		</ImgSelect>
	)
)

export const ImageSelectModal = connectImageSelect(
	({ setImage, fields, name }) => (
		<Modal
			control={props =>
				fields[name] ? (
					<SelectedImage {...props} id={fields[name]} />
				) : (
					<button type='button' {...props}>
						Set cover image...
					</button>
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
	)
)
