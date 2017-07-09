import styled, {css} from 'styled-components';
import colours from '@quarterto/colours';
import contrast from 'contrast';

export const background = ({colour = 'sky', shade = 3}) => {
	const bg = colours[colour][shade];

	return css`
		background: ${bg};
		color: ${contrast(bg) === 'dark' ? 'white' : colours.steel[0]};
	`;
};

const cardShadow = '0 5px 0.5px -3px';

export const etched = ({colour = 'sky', shade = 3, sunken = false, focused = false}) => css`
	${!sunken && background({colour, shade})}
	border: solid 1px ${({colour = 'sky', shade = 3}) => colours[colour][shade - 1]};
	box-shadow: ${[
		sunken && `inset ${cardShadow} ${colours.steel[4]}`,
		focused && `0 0 3px 2px ${colours.sky[4]}`,
	].filter(i => i).join() || 'none'};
`;

export const List = styled.div`
	display: flex;
	flex-wrap: wrap;

	margin: -2px;

	& > * {
		margin: 2px;
	}
`;

export const Grid = styled.div`
display: grid;
	padding: 1em;
	grid-gap: 1em;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
`;

export const Card = styled.div`
	grid-column-end: span ${({large}) => large ? 2 : 1};
	border: 1px solid ${colours.steel[3]};
	padding: 1em;
	border-radius: 2px;
	box-shadow: ${cardShadow} ${colours.steel[5]};
	column-width: 18em;
	column-gap: 1em;
`;

export const Label = styled.span`
	display: inline-block;
	${etched}
	${({large}) => !large && css`font-size: 0.8em;`}
	padding: .25em .6em;
	border-radius: .15em;
`;

export const LabelTitle = styled.span`
	display: inline-block;
	${({colour = 'sky', shade = 3}) => background({colour, shade: Math.max(0, shade - 1)})}
	margin: -.25em -.6em;
	padding: .25em .6em;
	border-radius: .15em;

	&:first-child {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		margin-right: .6em;
	}

	&:last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: .6em;
	}
`;

export const LabelButton = LabelTitle.withComponent('button').extend`
	border: 0 none;
	font: inherit;
	cursor: pointer;

	&:hover {
		${({colour = 'sky', shade = 3}) => background({colour, shade: Math.min(6, shade + 1)})}
	}
`;
