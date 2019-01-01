import React from 'react'
import { compose, getContext, withHandlers, withState } from 'recompact';
import { withTracker } from 'meteor/react-meteor-data'
import styled, { css } from 'styled-components'
import qs from 'querystring'

import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections';
import withLoading from './loading';
import { FlexGrid } from '../visual/grid';
import { fieldLike } from './form';
import preventingDefault from '../utils/preventing-default';
import Tabs from '../control/tabs'

const withSearch = withState('query', 'setQuery', '')

const withUnsplashSearch = withTracker(({ query }) => ({
	ready: query ? subscribe(['unsplash.search', query]) : false,
	photos: UnsplashPhotos.find({ fromSearch: query }).fetch(),
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
`;

const ImgSelect = styled.button`
	border: 0 none;
	background: none;
	padding: 0;

	${({ selected }) => selected && css`
		outline: 5px solid blue;
	`};
`

const getThumb = ({ urls }) => urls.raw + '&' + qs.stringify({
	fit: 'crop',
	crop: 'entropy',
	w: 450,
	h: 150,
})

const ImageSelectSection = ({ photos, setImage, fields, name }) => <FlexGrid small>
	{photos.map(
		photo => <ImgSelect
			selected={fields[name] === photo.id}
			onClick={preventingDefault(() => setImage(photo.id))}
			key={photo.id}
		>
			<FlexImg width={450} height={150} src={getThumb(photo)} alt={photo.description} />
		</ImgSelect>
	)}
</FlexGrid>;

const SearchImage = connectSearch(({ query, setQuery, ready, ...props }) => <>
	<input onChange={(ev) => setQuery(ev.target.value)} type='search' value={query} />
	{query && (ready ? <ImageSelectSection {...props} /> : 'loading...')}
</>)

const CollectionImage = connectCollection(ImageSelectSection)

export default connectImageSelect(({ setImage, fields, name }) => <Tabs>{{
	'Defaults': <CollectionImage {...{ setImage, fields, name }} />,
	'Search': <SearchImage {...{ setImage, fields, name }} />,
}}</Tabs>)