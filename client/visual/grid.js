import styled from 'styled-components';
import shortId from '@quarterto/short-id';

const bleed = `__bleed_${shortId()}`;

export const Bleed = styled.div.attrs({className: bleed})`
	grid-column: bleed;
`;

export default styled.div`
	display: grid;
	width: 100%;

	grid-template-columns: [bleed-start] 1fr [content-start] minmax(auto, 60em) [content-end] 1fr [bleed-end];
	grid-gap: 1em;

	> :not(.${bleed}) {
		grid-column: content;
	}
`;
