import React, { useState } from 'react'
import useInterval from 'use-interval'
import styled, { keyframes } from 'styled-components'

const blink = keyframes`
	0%   { opacity: 0; }
	49%  { opacity: 0; }
	50%  { opacity: 1; }
	100% { opacity: 0; }
`

const Time = styled.span`
	font-size: 2em;
	line-height: 1;
	color: ${({ late, reallyLate, lateAF }) =>
		lateAF ? '#c00' : reallyLate ? '#900' : late ? '#600' : 'black'};

	transition: color linear 60s;
`

const Hour = styled.span``
const Minute = styled.span``
const Colon = styled.span`
	animation: 1s ${blink} infinite ease-out;
	vertical-align: 0.1em;
	margin-left: -0.1em;
`

const AmPm = styled.span`
	font-variant: small-caps;
	font-size: 0.66em;
`

export const control = () => {
	const [date, setDate] = useState(new Date())
	useInterval(() => setDate(new Date()), 1000)

	const h = date.getHours() % 12
	const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
	const ampm = date.getHours() < 12 ? 'am' : 'pm'

	const late = date.getHours() > 20
	const reallyLate = date.getHours() > 21
	const lateAF = date.getHours() > 22

	return (
		<Time {...{ late, reallyLate, lateAF }}>
			<Hour>{h}</Hour>
			<Colon>:</Colon>
			<Minute>{m}</Minute>
			<AmPm>{ampm}</AmPm>
		</Time>
	)
}

export const display = () => null
