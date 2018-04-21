import React from 'react';
import {withCampaignData} from '../data/campaign';
import unsplashImages from '../visual/unsplash.json';
import {withProps} from 'recompact';
import styled from 'styled-components';
import stringHash from 'string-hash';

const Splash = withProps(({campaignId}) => {
	const image = unsplashImages[stringHash(campaignId) % unsplashImages.length];

	return {
		img: image.urls.regular,
		color: image.color,
	};
})(styled.div`
	background: url(${({img}) => img}), ${({color}) => color};
	background-size: cover;
	width: 100vw;
	height: 30vw;
	max-height: 40vh;
	background-position: center;
`);

export default withCampaignData(({campaign}) => <div>
	<Splash campaignId={campaign._id} />
</div>);
