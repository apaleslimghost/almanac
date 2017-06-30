import styled, {css} from 'styled-components';
import * as colours from '@quarterto/colours';
import contrast from 'contrast';

const background = (bg, shade = 3) => {
	const colour = colours[bg][shade];

	return css`
		background: ${colour};
		color: ${contrast(colour) === 'dark' ? 'white' : colours.steel[0]};
	`;
};

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
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

export const Card = styled.div`
	border: 1px solid ${colours.steel[3]};
	padding: 1em;
	border-radius: 2px;
	box-shadow: 0 5px 0.5px -3px ${colours.steel[5]};
`;

export const Label = styled.span`
	${({colour = 'sky', shade}) => background(colour, shade)}
	padding: 3px 5px;
	font-size: 0.8em;
	border-radius: 1px;
`
