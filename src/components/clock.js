import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';

const blink = keyframes`
	0% {
		opacity: 0;
	}

	49% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
`;

const Time = styled.span`
	font-size: 2em;
	line-height: 1;
	color: ${({late, reallyLate}) =>
		reallyLate
			? '#900'
			: late
				? '#600'
				: 'black'
	};
`;

const Hour = styled.span``;
const Minute = styled.span``;
const Colon = styled.span`
	animation: 1s ${blink} infinite ease-out;
	vertical-align: 0.1em;
	margin-left: -0.1em;
`;

const AmPm = styled.span`
	font-variant: small-caps;
	font-size: 0.66em;
`;

export const control = class Clock extends Component {
	state = {
		date: new Date
	};

	componentWillMount() {
		this.timer = setInterval(() => {
			this.setState({date: new Date});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		const {date} = this.state;
		const h = date.getHours() % 12;
		const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		const ampm = date.getHours() < 12 ? 'am' : 'pm';

		const late = date.getHours() > 20;
		const reallyLate = date.getHours() > 21;

		return <Time {...{late, reallyLate}}>
			<Hour>{h}</Hour>
			<Colon>:</Colon>
			<Minute>{m}</Minute>
			<AmPm>{ampm}</AmPm>
		</Time>;
	}
}

export const display = () => null;
