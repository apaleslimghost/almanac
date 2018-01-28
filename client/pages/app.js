import React from 'react';
import {setsCampaign} from '../components/collection/campaign';

const App = setsCampaign(({children}) => <main>
	{children}
</main>);

export default App;
