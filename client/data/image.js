import { withTracker } from 'meteor/react-meteor-data'
import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections';

export default getImageId => withTracker(props => {
	const imageId = getImageId(props)
	return imageId ? {
		ready: subscribe(
			['unsplash.getPhoto', imageId]
		),
		image: UnsplashPhotos.findOne(imageId),
	} : {}
})
