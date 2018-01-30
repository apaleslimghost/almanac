import React from 'react';
import styled, {css} from 'styled-components';
import colours from '@quarterto/colours';
import contrast from 'contrast';
import {darken} from 'polished';
import Ionicon from 'react-ionicons';

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
	${sunken ? css`background-color: white;` : background({colour, shade})}
	border: solid 1px ${({colour = 'sky', shade = 3}) => colours[colour][shade - 1]};
	box-shadow: ${[
		sunken && `inset ${shadow()}`,
		focused && `0 0 3px 2px ${colours.sky[4]}`,
	].filter(i => i).join() || 'unset'};
`;

export const List = styled.div.attrs({
	'data-spacing': ({spaced}) => spaced ? '0.5em' : '2px',
})`
	display: flex;
	align-items: ${({vertical}) => vertical ? 'stretch' : 'flex-start'};
	flex-wrap: wrap;
	flex-direction: ${({vertical}) => vertical ? 'column' : 'row'};
	margin: -${({'data-spacing': spacing}) => spacing};

	& > * {
		margin: ${({'data-spacing': spacing}) => spacing};
	}
`;

export const Padded = styled.div`
	margin: 1rem;
`;

export const Grid = Padded.extend`
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
`;

export const Card = styled.div`
	grid-column-end: span ${({large}) => large ? 2 : 1};
	border: 1px solid ${colours.steel[3]};
	padding: 1rem;
	border-radius: 2px;
	box-shadow: ${shadow()};
	column-width: 18em;
	column-gap: 1rem;
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
	${({fullWidth}) => fullWidth && css`width: 100%;`}
	${({flex}) => flex && css`flex: 1;`}
	${({right}) => right && css`text-align: right;`}
`;

const Textarea_ = Input_.withComponent('textarea').extend`
	resize: vertical;
	min-height: 10em;
`;

const Select_ = Input_.withComponent('select').extend`
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='5'%3E%3Cpath d='M 5,5 0,0 10,0 Z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-size: 0.5em 0.25em;
	background-position: right 0.5em center;
	appearance: none;
	padding-right: 1.5em;

	&:invalid {
		color: rgba(0, 0, 0, 0.6);
	}
`;

const fieldIsh = (Tag, extra) => props => <Tag colour='steel' shade={4} sunken large {...extra} {...props} />

export const Input = fieldIsh(Input_);
export const Textarea = fieldIsh(Textarea_);
export const Select = fieldIsh(Select_, {required: true});

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

export const Button = props => <Button_ large {...props}>
	<LabelBody>{props.children}</LabelBody>
</Button_>;

export const Group = List.extend`
	${List} > & {
		margin: 2px;
	}

	box-shadow: ${shadow(1)};

	${Button_} {
		margin-left: -1px;
		margin-right: 0;
		border-radius: 0;

		&:hover {
			box-shadow: ${shadow(0.5)};
		}

		&:active {
			box-shadow: ${shadow(0)};
		}

		&:first-child {
			border-top-left-radius: .15em;
			border-bottom-left-radius: .15em;
		}

		&:last-child {
			border-top-right-radius: .15em;
			border-bottom-right-radius: .15em;
		}
	}
`;

export const Icon = styled(Ionicon)`
	fill: currentColor;
	height: 1rem;
	margin-bottom: -2px;
`;

export const LabelledInput = List.withComponent('label').extend`
	align-items: center;
`;
