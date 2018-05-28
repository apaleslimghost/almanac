import styled from 'styled-components';
import shortId from '@quarterto/short-id';

const bleed = `__bleed_${shortId()}`;

export const Bleed = styled.div.attrs({className: bleed})`
	grid-column: bleed;
`;

export default styled.div`
	display: grid;
	width: 100%;

	grid-template-columns: [bleed-start] 1fr [full-start left-start left-two-start] minmax(auto, 15em) [left-end center-start right-two-start]  minmax(auto, 30em) [center-end left-two-end right-start] minmax(auto, 15em) [full-end right-end right-two-end] 1fr [bleed-end];
	grid-gap: 1em;

	> :not(.${bleed}) {
		grid-column: full;
	}
`;
