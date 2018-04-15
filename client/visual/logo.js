import React from 'react';
import styled from 'styled-components';

const LogoImg = styled.img`
	height: ${({large}) => large ? '3em' : '2em'};
	margin: 0.5em 1rem;
`;

const Logo = props => <LogoImg src='/images/logo.svg' alt='Almanac' {...props} />;

export default Logo;
