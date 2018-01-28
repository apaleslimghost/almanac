import React from 'react';
import {setsCampaign} from '../data/campaign';

const App = setsCampaign(({children}) => <main>
	{children}
</main>);

export default App;
