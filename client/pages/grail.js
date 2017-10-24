import React from 'react';
import CardList from '../components/card-list';
import Filter from '../components/filter';

export default ({campaignId}) => <div>
	<Filter />
	<CardList campaignId={campaignId} />
</div>;
