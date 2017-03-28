import React from 'react';
import {observe} from '../store';
import withState from './state';

const Weather = observe((props, {subscribe}) => <pre>
	{JSON.stringify(subscribe('weather'), null, 2)}
</pre>);

const WeatherForm = withState(
	({weather}) => weather,
	({weather, onSubmit}, state, setState) => <div>
		<div>
			<label>Humidity {state.humidity}</label>
			<input
				type='range' min={0} max={10}
				placeholder='humidity'
				value={state.humidity}
				onChange={ev => setState({humidity: ev.target.valueAsNumber})} />
		</div>
		<div>
			<label>Temperature {state.temperature}</label>
			<input
				type='range' min={0} max={10}
				placeholder='temperature'
				value={state.temperature}
				onChange={ev => setState({temperature: ev.target.valueAsNumber})} />
		</div>
		<button onClick={() => onSubmit(state)}>Set</button>
	</div>
);

const WeatherFormConnector = observe((props, {subscribe, dispatch}) => <WeatherForm
	weather={subscribe('weather')}
	onSubmit={weather => dispatch('weather', () => weather)}
/>);

const WeatherControl = () => <div>
	<Weather />
	<WeatherFormConnector />
</div>

export {
	WeatherControl as control,
	Weather as display
};
