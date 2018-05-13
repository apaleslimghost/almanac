import styled from 'styled-components';

export default styled.div`
	display: grid;
	width: 100%;

	grid-template-rows: [bleed-start] auto [content-start content-end] auto [bleed-end];
	grid-template-columns: [bleed-start] auto [content-start] fit-content(60em) [content-end] auto [bleed-end];
	grid-gap: 1em;

	> * {
		grid-area: content;
	}
`;
