import React from 'react';
import styled from 'styled-components';
import OdreianDate from 'dream-date/calendar/odreian';
import Ornamented from '../../visual/ornamented';
import {withTracker} from 'meteor/react-meteor-data';
import {withCampaignSession} from '../../data/campaign';
import {compose, withReducer, withHandlers, withPropsOnChange} from 'recompose';
import preventingDefault from '../../utils/preventing-default';

// For now we just use the first moon in the schema,
// later we may want to support multiple moons 😱.
// We also have to have a default because moon phases
// are configurable in Dream Date
const moonPhaseIcon = date => {
	const moonPhaseIndex = Object.values(date.moonPhaseIndices)[0] || 0;
	return [
		'🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔',
	][moonPhaseIndex] || '🌕'
};

const compassDir = heading => [
	'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
][Math.round(heading * 16/360) % 16];

const weatherCondition = ({temperature, humidity}) => [
['winter',     'sun-cloud',      'day',            'sun',       'dry',        'fire'],
['sun-snow',   'cloud-wind',     'sun-cloud',      'sun-fog',   'sun-fog',    'tornado'],
['cloud-snow', 'sun-cloud-rain', 'sun-cloud-rain', 'sun-cloud', 'heavy-rain', 'lightning'],
['snow-storm', 'cloud-rain',     'wet',            'lightning', 'lightning',  'heavy-lightning'],
]
[Math.min(3, Math.floor(humidity * 4 / 100))]
[Math.min(5, Math.floor((20 + temperature) * 6 / 80))];

const defaultWeather = {
	temperature: 10,
	humidity: 50,
	windHeading: 0,
	windSpeed: 10,
};

// fast linear that      ︵__
// goes a bit too far   /
// and slinks back     /
const youreSoVane = 'cubic-bezier(.52, 1.65, .29, .9)';

const WindArrow = styled.span`
display: inline-block;
will-change: transform;
transform: rotate(${({heading}) => heading}deg);
transition: transform 2s ${youreSoVane};
`;

const WindDirection = ({heading}) => <span>
	<WindArrow heading={heading - 90}>➳</WindArrow>
	<small>{compassDir((heading + 180) % 360)}</small>
</span>;

const WeatherIcon = styled.div`
display: inline;
vertical-align: -0.85em;
font-size: 3em;
text-align: center;

img {
	width: 1em;
	height: 1em;
}
`;

const WeatherThings = styled.div`
display: flex;
justify-content: space-between;
margin-top: 2rem;
margin-bottom: -2rem;
position: relative;
z-index: 2;
`;

const WeatherThing = styled.div`
line-height: 0;
font-size: 1.25em;
`;

const WeatherWrapper = styled.div`
margin-top: 1rem;
`;

const WeatherCondition = ({temperature, humidity}) => {
	const condition = weatherCondition({temperature, humidity});
	return <img src={`/weather/${condition}.png`} alt={condition} />;
};

// TODO: seasons, sunset time

const withWeatherData = withTracker(({campaignSession}) => {
	const date = new OdreianDate(campaignSession.get('date'));
	return {
		weather: campaignSession.get('weather') || defaultWeather,
		date
	}
});

const connectWeather = compose(
	withCampaignSession,
	withWeatherData
);

const Weather = connectWeather(
	({weather: {temperature, humidity, windHeading, windSpeed}, date}) =>
		<WeatherWrapper>
			<WeatherThings>
				<WeatherThing large>{temperature}°C</WeatherThing>
				<WeatherThing><WindDirection heading={windHeading} /></WeatherThing>
			</WeatherThings>
			<Ornamented ornament='k'>
				<WeatherIcon small={date.isNight}>
					{date.isNight
						? moonPhaseIcon(date)
						: <WeatherCondition {...{temperature, humidity}} />
					}
				</WeatherIcon>
			</Ornamented>
		</WeatherWrapper>
);

const FixedWidthLabel = styled.label`
display: inline-block;
width: ${({size = 3.5}) => size}em;
`;

const withWeatherState = withReducer(
	'_weather',
	'setWeather',
	Object.assign,
	({weather}) => weather
);

const weatherFormActions = withHandlers({
	onSubmit: ({campaignSession, _weather}) => ev => {
		campaignSession.set('weather', _weather);
	}
});

const connectWeatherForm = compose(
	withCampaignSession,
	withWeatherData,
	withWeatherState,
	weatherFormActions,
	withPropsOnChange(['weather'], ({weather, setWeather}) => {
		setWeather(weather);
	})
);

const WeatherForm = connectWeatherForm(({_weather, setWeather, onSubmit}) => <form onSubmit={preventingDefault(onSubmit)}>
	<div>
		<FixedWidthLabel>{_weather.temperature}°C</FixedWidthLabel>
		<input
			type='range' min={-20} max={60}
			placeholder='temperature'
			value={_weather.temperature}
			onChange={ev => setWeather({temperature: ev.target.valueAsNumber})} />
	</div>
	<div>
		<FixedWidthLabel>{_weather.humidity}%</FixedWidthLabel>
		<input
			type='range' min={0} max={100} step={5}
			placeholder='humidity'
			value={_weather.humidity}
			onChange={ev => setWeather({humidity: ev.target.valueAsNumber})} />
	</div>
	<div>
		<FixedWidthLabel><WindDirection heading={_weather.windHeading} /></FixedWidthLabel>
		<input
			type='range' min={0} max={359} step={5}
			placeholder='windHeading'
			value={_weather.windHeading}
			onChange={ev => setWeather({windHeading: ev.target.valueAsNumber})} />
	</div>
	<div>
		<FixedWidthLabel>{_weather.windSpeed}<small>KN</small></FixedWidthLabel>
		<input
			type='range' min={0} max={120} step={5}
			placeholder='windSpeed'
			value={_weather.windSpeed}
			onChange={ev => setWeather({windSpeed: ev.target.valueAsNumber})} />
	</div>
	<button>Set</button>
</form>);

const WeatherControl = () => <div>
	<Weather />
	<WeatherForm />
</div>;

export {
	WeatherControl as control,
	Weather as display
};
