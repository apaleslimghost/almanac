import styled, { css } from 'styled-components'
import select from '../utils/select'

export const FlexGrid = styled.div`
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: repeat(
		auto-fill,
		minmax(${({ small }) => (small ? '9em' : '18em')}, 1fr)
	);
`

const main = css`
	grid-column: ${select({
		left: 'main-left',
		right: 'main-right',
		default: 'main',
	})};
`

export const Main = styled.div`
	${main}
`

export const Aside = styled.aside`
	grid-column: ${select({
		left: 'left',
		default: 'right',
	})};
`

export const MainGrid = FlexGrid.extend`
	${main}
`

export default styled.div`
	display: grid;
	width: 100%;

	/* |---|         main          |---| */
	/* |---| left | center | right |---| */
	/* |---|   main-left   |       |---| */
	/* |---|      |   main-right   |---| */
	/* |            bleed              | */

	grid-template-columns:
		[ bleed-start ]
		1fr
		[ left-start main-left-start main-start ]
		minmax(auto, 20em)
		[ left-end main-right-start center-start ]
		minmax(auto, 40em)
		[ right-start main-left-end center-end ]
		minmax(auto, 20em)
		[ right-end main-right-end main-end ]
		1fr
		[ bleed-end ];

	grid-gap: 1rem;
	padding: 1rem 0;
`
