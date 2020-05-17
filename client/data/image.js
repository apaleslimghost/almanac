import { useSubscription } from '../utils/hooks'
import { UnsplashPhotos } from '../../shared/collections'

const getImageSubscription = (image = { from: 'nowhere' }) => {
	switch (image.from) {
		case undefined:
			// backwards compatibility for implicit unsplash images
			return getImageSubscription({ from: 'unsplash', id: image })

		case 'unsplash':
			return {
				image: UnsplashPhotos.findOne(image.id),
				subscription: ['unsplash.getPhoto', image.id],
			}
	}

	return { image: null, subscription: [false, null] }
}

export const useImage = imageQuery => {
	const { subscription, image } = getImageSubscription(imageQuery)
	const ready = useSubscription(...subscription)
	return { ready, image }
}
