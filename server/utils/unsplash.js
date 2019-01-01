import { HTTP } from 'meteor/http'
import url from 'url'

const unsplash = (pathname, options) => HTTP.get(
	url.format({
		protocol: 'https',
		hostname: 'api.unsplash.com',
		pathname
	}),
	{
		headers: {
			'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
		},
		...options,
	}
).data

export const getCollectionPhotos = collectionId => unsplash(
	`collections/${collectionId}/photos`,
	{
		params: {
			per_page: 100,
			order_by: 'popular',
		}
	}
)

export const getPhoto = photoId => unsplash(
	`photos/${photoId}`
)

export default unsplash