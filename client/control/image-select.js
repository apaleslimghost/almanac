import React, { useContext, useState } from 'react'
import qs from 'querystring'
import { useTracker } from 'meteor/quarterto:hooks'
import styled, { css } from 'styled-components'

import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections'
import { FlexGrid } from '../visual/grid'
import preventingDefault from '../utils/preventing-default'
import { unsplashDownload } from '../../shared/methods'

import { Button, List } from '../visual/primitives'
import Icon from '../visual/icon'
import Tabs from './tabs'
import Modal from './modal'
import { FieldLike } from './form'

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

const useUnsplashSearch = query =>
	useTracker(
		() => ({
			ready: query ? subscribe(['unsplash.search', query]) : false,
			photos: UnsplashPhotos.find({ fromSearch: query }).fetch(),
		}),
		[query],
	)

const useAlmanacCollection = useTracker(() => ({
	ready: subscribe(['unsplash.getCollectionPhotos', '2021417']),
	photos: UnsplashPhotos.find({ fromCollection: '2021417' }).fetch(),
}))

const SearchImage = props => {
	const [query, setQuery] = useState('')
	const { ready, photos } = useUnsplashSearch(query)
	return (
		<>
			<input
				type='search'
				value={query}
				onChange={ev => setQuery(ev.target.value)}
			/>
			{query &&
				(ready ? (
					<ImageSelectSection {...props} photos={photos} />
				) : (
					'loading...'
				))}
		</>
	)
}

const CollectionImage = props => {
	const { ready, photos } = useAlmanacCollection()
	if (!ready) return 'Loading...'

	return <ImageSelectSection {...props} photos={photos} />
}

const ImageSelectTabs = props => (
	<Tabs>
		{{
			Suggested: <CollectionImage {...props} />,
			Search: <SearchImage {...props} />,
		}}
	</Tabs>
)

export default ImageSelectTabs

export const ImageSelectModal = ({ name }) => {
	const { fields, setFields } = useContext(FieldLike)
	function setImage(image) {
		setFields({
			[name]: image,
		})

		if (image) {
			unsplashDownload(image.id)
		}
	}

	return (
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
	)
}
