import React from 'react'
import styled, { css } from 'styled-components'
import colours from '@quarterto/colours'
import contrast from 'contrast'

export const background = ({ colour = 'sky', shade = 3 }) => {
	const bg = colours[colour][shade]

	return css`
		background: ${bg};
		color: ${contrast(bg) === 'dark' ? 'white' : colours.steel[0]};
	`
}

export const shadow = (level = 1) =>
	[0, 5, 4 * level - 3.5, 2 * level - 5]
		.map(a => `${a}px`)
		.concat('rgba(0, 0, 0, 0.2)')
		.join(' ')

export const etched = ({
	colour = 'sky',
	shade = 3,
	sunken = false,
	focused = false,
}) => css`
	${
		sunken
			? css`
					background-color: white;
			  `
			: background({ colour, shade })
	}
	border: solid 1px ${colours[colour][shade - 1]};
	box-shadow: ${[
		sunken && `inset ${shadow()}`,
		focused && `0 0 3px 2px ${colours.sky[4]}`,
	]
		.filter(i => i)
		.join() || 'unset'};
`

export const List = styled.div.attrs({
	'data-spacing': ({ spaced }) => (spaced ? '0.5em' : '2px'),
})`
	display: flex;
	align-items: ${({ vertical }) => (vertical ? 'stretch' : 'flex-start')};
	flex-wrap: wrap;
	flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};
	margin: -${({ 'data-spacing': spacing }) => spacing};

	& > * {
		margin: ${({ 'data-spacing': spacing }) => spacing};
	}
`

export const Padded = styled.div`
	margin: 1rem;
`

export const Card = styled.div`
	grid-column-end: span ${({ large }) => (large ? 2 : 1)};
	border: 1px solid ${colours.steel[3]};
	padding: 1rem 1rem 0;
	border-radius: 2px;
	box-shadow: ${shadow()};
	column-width: 18em;
	column-gap: 1rem;
`

// TODO: use theme for label colour

export const Label = styled.span`
	display: inline-block;
	${etched}
	${({ large }) =>
		!large &&
		css`
			font-size: 0.8em;
		`}
	padding: .25em 0;
	border-radius: 0.15em;
`

export const LabelBody = styled.span`
	padding: 0 0.6em;
`

export const LabelTitle = styled.span`
	display: inline-block;
	${({ colour = 'sky', shade = 3 }) =>
		background({ colour, shade: Math.max(0, shade - 1) })}
	padding: .25em .6em;
	margin: -0.25em 0;
	border: 0 solid ${({ colour = 'sky', shade = 3 }) => colours[colour][shade]};

	border-right-width: 1px;

	&:first-child {
		border-radius: 0.15em;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	&:last-child {
		border-radius: 0.15em;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	${LabelBody} ~ & {
		border-right-width: 0;
		border-left-width: 1px;
		margin-right: -1px; /* but why? */
	}
`

export const LabelButton = LabelTitle.withComponent('button').extend`
	appearance: none;
	font: inherit;
	cursor: pointer;

	&:hover {
		${({ colour = 'sky', shade = 3 }) =>
			background({ colour, shade: Math.min(6, shade + 1) })}
	}
`

export const Emoji = styled.span`
	line-height: 1;
`

export const FormGroup = styled.label`
	display: block;
	margin-bottom: 0.5em;
`

const Button_ = Label.withComponent('button').extend`
	font: inherit;
	transition-property: box-shadow, transform, background, opacity;
	transition-duration: 100ms;
	transition-timing-function: linear;
	box-shadow: ${shadow(1)};
	cursor: pointer;

	&:hover {
		${({ colour = 'sky', shade = 3 }) =>
			background({ colour, shade: Math.min(6, shade + 1) })}
		box-shadow: ${shadow(1.5)};
		${''}
	}

	&:active {
		transition-property: box-shadow, background;
		box-shadow: ${shadow(0)};
		${''}
	}

	&[disabled] {
		pointer-events: none;
		opacity: 0.6;
	}
`

const makeButton = ({ Button, Body }) => props => (
	<Button large {...props}>
		<Body>{props.children}</Body>
	</Button>
)

export const Button = makeButton({
	Button: Button_,
	Body: LabelBody,
})

Button.extend = (...args) =>
	makeButton({
		Button: Button_.extend(...args),
		Body: LabelBody,
	})

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
			border-top-left-radius: 0.15em;
			border-bottom-left-radius: 0.15em;
		}

		&:last-child {
			border-top-right-radius: 0.15em;
			border-bottom-right-radius: 0.15em;
		}
	}
`

export const LabelledInput = List.withComponent('label').extend`
	align-items: center;
`
