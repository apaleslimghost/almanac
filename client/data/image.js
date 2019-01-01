import { withTracker } from 'meteor/react-meteor-data'
import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections';

export default getImageId => withTracker(props => {
	let image = getImageId(props)

	if (image) {
		switch (image.from) {
			case 'unsplash':
				return {
					ready: subscribe(
						['unsplash.getPhoto', image.id]
					),
					image: UnsplashPhotos.findOne(image.id),
				}
		}
	}

	return {}
})
