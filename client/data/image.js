import { useSubscription, useCursor } from 'meteor/quarterto:hooks'
import { UnsplashPhotos } from '../../shared/collections'

const getImageSubscription = (image = { from: 'nowhere' }) => {
	switch (image.from) {
		case undefined:
			// backwards compatibility for implicit unsplash images
			return getImageSubscription({ from: 'unsplash', id: image })

		case 'unsplash':
			return {
				cursor: UnsplashPhotos.findOne(image.id),
				subscription: ['unsplash.getPhoto', image.id],
			}
	}

	return { cursor: null, subscription: [] }
}

export const useImage = imageQuery => {
	const { subscription, cursor } = getImageSubscription(imageQuery)
	const ready = useSubscription(...subscription)
	const image = useCursor(cursor, [ready])
	return { ready, image }
}
