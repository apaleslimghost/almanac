import React from 'react';
import {observe} from '../store';
import withState from './state';
import styled from 'styled-components';

const Weather = observe((props, {subscribe}) => {
	const {temperature, humidity} = subscribe('weather');
	return <ul>
		<li>{temperature}℃</li>
		<li>{humidity}% humidity</li>
	</ul>;
});

const FixedWidthLabel = styled.label`
display: inline-block;
width: ${({size = 4}) => size}em;
`;

const WeatherForm = withState(
	({weather}) => weather,
	({weather, onSubmit}, state, setState) => <div>
		<div>
			<FixedWidthLabel>{state.temperature}℃</FixedWidthLabel>
			<input
				type='range' min={-20} max={60}
				placeholder='temperature'
				value={state.temperature}
				onChange={ev => setState({temperature: ev.target.valueAsNumber})} />
		</div>
		<div>
			<FixedWidthLabel>{state.humidity}%</FixedWidthLabel>
			<input
				type='range' min={0} max={100} step={5}
				placeholder='humidity'
				value={state.humidity}
				onChange={ev => setState({humidity: ev.target.valueAsNumber})} />
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
