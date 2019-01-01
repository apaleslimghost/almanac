import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import url from 'url'

const unsplash = (pathname, options) => {
	try {
		return HTTP.get(
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
	} catch (error) {
		if (error.response && error.response.content === 'Rate Limit Exceeded') {
			throw new Meteor.Error(
				'unsplash-rate-limit',
				'Image search is currently unavailable. Try again in a few minutes'
			)
		}
	}
}

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

export const search = query => unsplash(
	`photos/search`,
	{
		params: {
			per_page: 100,
			order_by: 'popular',
			query
		}
	}
)

export default unsplash