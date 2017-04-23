import React from 'react';
import {observe} from '../store';
import withState from './state';
import styled from 'styled-components';
import OdreianDate from 'odreian-date';

const moonPhase = date => [
	'🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔',
][Math.floor(date * 8/30)];

const compassDir = heading => [
	'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
][Math.round(heading * 16/360) % 16];

const WindArrow = styled.span`
display: inline-block;
transform: rotate(${({heading}) => heading}deg);
`;

const WindDirection = ({heading}) => <span>
	<WindArrow heading={heading - 90}>➳</WindArrow>
	<small>{compassDir((heading + 180) % 360)}</small>
</span>;

const Weather = observe((props, {subscribe}) => {
	const {temperature, humidity, windHeading, windSpeed} = subscribe('weather');
	const date = new OdreianDate(subscribe('date')).dateIndex;
	return <ul>
		<li>{temperature}℃</li>
		<li>{humidity}% humidity</li>
		<li><WindDirection heading={windHeading} /> {windSpeed}<small>KN</small></li>
		<li>{moonPhase(date)}</li>
	</ul>;
});

const FixedWidthLabel = styled.label`
display: inline-block;
width: ${({size = 3.5}) => size}em;
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
		<div>
			<FixedWidthLabel><WindDirection heading={state.windHeading} /></FixedWidthLabel>
			<input
				type='range' min={0} max={359} step={5}
				placeholder='windHeading'
				value={state.windHeading}
				onChange={ev => setState({windHeading: ev.target.valueAsNumber})} />
		</div>
		<div>
			<FixedWidthLabel>{state.windSpeed}<small>KN</small></FixedWidthLabel>
			<input
				type='range' min={0} max={120} step={5}
				placeholder='windSpeed'
				value={state.windSpeed}
				onChange={ev => setState({windSpeed: ev.target.valueAsNumber})} />
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
