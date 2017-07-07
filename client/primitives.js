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

export const etched = ({colour = 'sky', shade = 3}) => css`
	${background({colour, shade})}
	box-shadow: inset 0 0 0 1px ${colours[colour][Math.max(0, shade - 1)]};
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
	box-shadow: 0 5px 0.5px -3px ${colours.steel[5]};
	column-width: 18em;
	column-gap: 1em;
`;

export const Label = styled.span`
	${etched}
	box-shadow: inset 0 0 0 1px ${({colour = 'sky', shade = 3}) => colours[colour][shade - 1]};
	padding: 3px 7px;
	font-size: 0.8em;
	border-radius: 2px;
`
