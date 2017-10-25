import React from 'react';
import CardList from '../components/card-list';
import Filter from '../components/filter';

export default ({campaignId}) => <div>
	<Filter campaignId={campaignId} />
	<CardList campaignId={campaignId} />
</div>;
