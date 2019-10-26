import { withTracker } from 'meteor/react-meteor-data'
import { useTracker } from 'meteor/quarterto:hooks'
import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections'

const getImageSubscription = image => {
	switch (image.from) {
		case undefined:
			// backwards compatibility for implicit unsplash images
			return getImageSubscription({ from: 'unsplash', id: image })

		case 'unsplash':
			return {
				ready: subscribe(['unsplash.getPhoto', image.id]),
				image: UnsplashPhotos.findOne(image.id),
			}
	}

	return {}
}

export default getImageId =>
	withTracker({
		pure: false,
		getMeteorData(props) {
			const image = getImageId(props)

			if (image) {
				return getImageSubscription(image)
			}

			return {}
		},
	})

export const useImage = image =>
	useTracker(() => {
		if (image) {
			return getImageSubscription(image)
		}

		return {}
	}, [image])
