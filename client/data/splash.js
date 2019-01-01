import { withTracker } from 'meteor/react-meteor-data'
import subscribe from '../utils/subscribe'
import { UnsplashPhotos } from '../../shared/collections';

export default withTracker(({ campaign }) => ({
	ready: subscribe(
		['unsplash.getPhoto', campaign.theme]
	),
	splash: UnsplashPhotos.findOne(campaign.theme),
}))
