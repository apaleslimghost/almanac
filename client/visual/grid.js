import { Random } from 'meteor/random'
import styled from 'styled-components'

export const bleed = `__bleed_${Random.id(8)}`

export const Bleed = styled.div.attrs({ className: bleed })`
	grid-column: bleed;
`

export const FlexGrid = styled.div`
	display: grid;
	grid-gap: 1rem;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
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
		minmax(auto, 15em)
		[ left-end main-right-start center-start ]
		minmax(auto, 30em)
		[ right-start main-left-end center-end ]
		minmax(auto, 15em)
		[ right-end main-right-end main-end ]
		1fr
		[ bleed-end ];

	grid-gap: 1rem;

	> :not(.${bleed}) {
		grid-column: main;
	}

	> :first-child:not(.${bleed}) {
		margin-top: 1rem;
	}
`
