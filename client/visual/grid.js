import styled from 'styled-components';
import shortId from '@quarterto/short-id';

const bleed = `__bleed_${shortId()}`;

export const Bleed = styled.div.attrs({className: bleed})`
	grid-column: bleed;
`;

export default styled.div`
	display: grid;
	width: 100%;

	/* |---|         main          |---| */
	/* |---| left | center | right |---| */
	/* |---|   left-main   |       |---| */
	/* |---|      |   right-main   |---| */
	/* |             bleed             | */

	grid-template-columns:
		[ bleed-start ]
			1fr
		[ left-start  main-left-start  main-start   ]
			minmax(auto, 15em)
		[ left-end    main-right-start center-start ]
			minmax(auto, 30em)
		[ right-start main-left-end    center-end   ]
			minmax(auto, 15em)
		[ right-end   main-right-end   main-end     ]
			1fr
		[ bleed-end] ;

	grid-gap: 1em;

	> :not(.${bleed}) {
		grid-column: main;
	}
`;
