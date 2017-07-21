import React from 'react';
import styled, {css} from 'styled-components';
import colours from '@quarterto/colours';
import contrast from 'contrast';
import {darken} from 'polished';
import Ionicon from 'react-ionicons';

//TODO: bring in Wick typography
//TODO: split out into a @quarterto/primitives module
//TODO: icons
//TODO: buttons

export const background = ({colour = 'sky', shade = 3}) => {
	const bg = colours[colour][shade];

	return css`
		background: ${bg};
		color: ${contrast(bg) === 'dark' ? 'white' : colours.steel[0]};
	`;
};

export const shadow = (level = 1, {colour = 'steel', shade = 5} = {}) => [
	0,
	5,
	4 * level - 3.5,
	2 * level - 5,
]
	.map(a => `${a}px`)
	.concat(darken(0.2 * (level - 1), colours[colour][shade]))
	.join(' ');

export const etched = ({colour = 'sky', shade = 3, sunken = false, focused = false}) => css`
	${!sunken && background({colour, shade})}
	border: solid 1px ${({colour = 'sky', shade = 3}) => colours[colour][shade - 1]};
	box-shadow: ${[
		sunken && `inset ${shadow()}`,
		focused && `0 0 3px 2px ${colours.sky[4]}`,
	].filter(i => i).join() || 'none'};
`;

export const List = styled.div`
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;

	margin: -2px;

	& > * {
		margin: 2px;
	}
`;

export const Padded = styled.div`
	margin: 1em;
`;

export const Grid = Padded.extend`
	display: grid;
	grid-gap: 1em;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
`;

export const Card = styled.div`
	grid-column-end: span ${({large}) => large ? 2 : 1};
	border: 1px solid ${colours.steel[3]};
	padding: 1em;
	border-radius: 2px;
	box-shadow: ${shadow()};
	column-width: 18em;
	column-gap: 1em;
`;

// TODO: use theme for label colour

export const Label = styled.span`
	display: inline-block;
	${etched}
	${({large}) => !large && css`font-size: 0.8em;`}
	padding: .25em 0;
	border-radius: .15em;
`;

export const LabelBody = styled.span`
	padding: 0 .6em;
`;

export const LabelTitle = styled.span`
	display: inline-block;
	${({colour = 'sky', shade = 3}) => background({colour, shade: Math.max(0, shade - 1)})}
	padding: .25em .6em;
	margin: -.25em 0;
	border: 0 solid ${({colour = 'sky', shade = 3}) => colours[colour][shade]};

	border-right-width: 1px;

	&:first-child {
		border-radius: .15em;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	&:last-child {
		border-radius: .15em;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	${LabelBody} ~ & {
		border-right-width: 0;
		border-left-width: 1px;
		margin-right: -1px; /* but why? */
	}
`;

export const LabelButton = LabelTitle.withComponent('button').extend`
	appearance: none;
	font: inherit;
	cursor: pointer;

	&:hover {
		${({colour = 'sky', shade = 3}) => background({colour, shade: Math.min(6, shade + 1)})}
	}
`;

export const Emoji = styled.span`
	line-height: 1;
`;

const Input_ = Label.withComponent('input').extend`
	padding-left: .3em;
	padding-right: .3em;
	font: inherit;
	width: 100%;
`;

const Textarea_ = Input_.withComponent('textarea').extend`
	resize: vertical;
	min-height: 10em;
`;

const fieldIsh = Tag => props => <Tag colour='steel' shade={4} sunken large {...props} />

export const Input = fieldIsh(Input_);
export const Textarea = fieldIsh(Textarea_);

export const FormGroup = styled.label`
	display: block;
	margin-bottom: .5em;
`;

const Button_ = Label.withComponent('button').extend`
	font: inherit;
	transition-property: box-shadow, transform, background;
	transition-duration: 100ms;
	transition-timing-function: linear;
	box-shadow: ${shadow(1)};
	cursor: pointer;

	&:hover {
		${({colour = 'sky', shade = 3}) => background({colour, shade: Math.min(6, shade + 1)})}
		box-shadow: ${shadow(1.5)};
		transform: translateY(-1px);
	}

	&:active {
		transition-property: box-shadow, background;
		box-shadow: ${shadow(0)};
		transform: translateY(2px);
	}
`;

export const Button = props => <Button_ large {...props} />

export const Icon = styled(Ionicon)`
	fill: currentColor;
	height: 1em;
	margin-bottom: -2px;
`;
