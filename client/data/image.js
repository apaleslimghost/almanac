import { withTracker } from 'meteor/react-meteor-data'
import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections';

export default getImageId => withTracker(props => ({
	ready: subscribe(
		['unsplash.getPhoto', getImageId(props)]
	),
	image: UnsplashPhotos.findOne(getImageId(props)),
}))
