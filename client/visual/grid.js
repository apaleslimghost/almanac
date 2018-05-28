import styled from 'styled-components';
import shortId from '@quarterto/short-id';

const bleed = `__bleed_${shortId()}`;

export const Bleed = styled.div.attrs({className: bleed})`
	grid-column: bleed;
`;

export default styled.div`
	display: grid;
	width: 100%;

	grid-template-columns: [bleed-start] 1fr [main-start left-start main-left-start] minmax(auto, 15em) [left-end center-start main-right-start]  minmax(auto, 30em) [center-end main-left-end right-start] minmax(auto, 15em) [main-end right-end main-right-end] 1fr [bleed-end];
	grid-gap: 1em;

	> :not(.${bleed}) {
		grid-column: main;
	}
`;
