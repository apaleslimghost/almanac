import styled, {keyframes} from 'styled-components';
import {background} from '../../colors';

const fadeIn = keyframes`
	0% {
		opacity: 0;
		transform: scale(3);
	}

	90% {
		opacity: 0.9;
		transform: scale(0.9);
	}

	100% {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	0%   { opacity: 1; }
	100% { opacity: 0; }
`;

const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${background};
	transform-origin: center;
	animation-name: ${
		({animationState}) => ({
			opening: fadeIn,
			closing: fadeOut,
		})[animationState] || 'none'
	};
	animation-duration: ${({animationState}) => animationState === 'opening' ? '200ms' : '5s'};
	animation-fill-mode: forwards;
	animation-timing-function: linear;
	animation-iteration-count: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	text-align: center;
`;

export default Modal;
