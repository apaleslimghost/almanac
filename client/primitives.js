import styled from 'styled-components';
import {grey} from '@quarterto/colours';

export const List = styled.div`
	display: grid;
	padding: 1em;
	grid-gap: 1em;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

export const Card = styled.div`
	border: 1px solid ${grey[5]};
	padding: 1em;
	border-radius: 2px;
`;
