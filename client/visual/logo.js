import styled from 'styled-components'

const Logo = styled.img.attrs({
	src: '/images/logo.svg',
	alt: 'Almanac',
})`
	height: ${({ large }) => (large ? '3em' : '1.6em')};
	margin: 0.5em 1rem;
`

export default Logo
