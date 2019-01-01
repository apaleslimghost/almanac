import { HTTP } from 'meteor/http'
import url from 'url'

const unsplash = pathname => HTTP.get(
	url.format({
		protocol: 'https',
		hostname: 'api.unsplash.com',
		pathname
	}),
	{
		headers: {
			'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
		}
	}
).data

export const getCollectionPhotos = collectionId => unsplash(
	`collections/${collectionId}/photos`
)

export const getPhoto = photoId => unsplash(
	`photos/${photoId}`
)

export default unsplash