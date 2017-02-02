import React from 'react';
import {observe} from '../src/store';
import OdreianDate from 'odreian-date'

const Time = observe((props, {subscribe}) => <h1>
	{new OdreianDate(subscribe('date', 0)).LLLL}
</h1>);

export default Time;