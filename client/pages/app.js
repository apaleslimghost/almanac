import React from 'react';
import {setsCampaign} from '../data/campaign';

const App = setsCampaign(({children}) => <div>
	{children}
</div>);

export default App;
