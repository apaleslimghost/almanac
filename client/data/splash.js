import { withProps } from 'recompact'
import stringHash from 'string-hash'
import unsplashImages from '../visual/unsplash.json'

export default withProps(({ campaign }) => {
	const image = campaign.theme
		? unsplashImages.find(({ id }) => id === campaign.theme)
		: unsplashImages[stringHash(campaign._id) % (unsplashImages.length - 1)] // Never choose the last one, so i can select it for testing purposes

	return {
		url: image.urls.regular,
		color: image.color
	}
})
