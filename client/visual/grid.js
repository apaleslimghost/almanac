import styled from 'styled-components';
import shortId from '@quarterto/short-id';

const bleed = `__bleed_${shortId()}`;

export const Bleed = styled.div.attrs({className: bleed})`
	grid-column: bleed;
`;

export default styled.div`
	display: grid;
	width: 100%;

	grid-template-rows: [bleed-start] auto [content-start content-end] auto [bleed-end];
	grid-template-columns: [bleed-start] auto [content-start] fit-content(60em) [content-end] auto [bleed-end];
	grid-gap: 1em;

	> :not(.${bleed}) {
		grid-column: content;
	}
`;
