import React, {Component} from 'react';
import colours from '@quarterto/colours';
import styled from 'styled-components';
import Popover from 'react-popover';

import {etched, LabelButton, Emoji} from './primitives';
import {fieldLike} from './form';
import preventingDefault from '../src/preventing-default';

const hues = Object.keys(colours);

const Chip = styled.a`
	${etched} width: 1rem;
	height: 1rem;
	border-radius: 1px;
	display: block;
	cursor: pointer;
`;

const Swatch = styled.div`
	display: grid;
	grid-template-columns: repeat(${hues.length}, 1rem);
	grid-gap: 2px;
`;


//TODO: popover

class ColourSelect extends Component {
	static contextTypes = fieldLike;

	state = {
		isOpen: false,
	};

	onSelect = colour => {
		const {name} = this.props;
		this.context.setState({
			[name]: colour,
		});
		this.setState({isOpen: false});
	};

	row = shade => colour => <Chip
		onClick={() => this.onSelect({colour, shade})}
		key={`${colour}${shade}`}
		colour={colour}
		shade={shade}
	/>;

	render() {
		return (
			<Popover
				isOpen={this.state.isOpen}
				enterExitTransitionDurationMs={0}
				preferPlace='below'
				body={
					<Swatch>
						{hues.map(this.row(4))}
						{hues.map(this.row(3))}
					</Swatch>
				}
			>
				<LabelButton
					{...this.context.state[this.props.name]}
					onClick={preventingDefault(() => this.setState({isOpen: !this.state.isOpen}))}
				>
					<Emoji>🎨</Emoji>
				</LabelButton>
			</Popover>
		);
	}
}

export default ColourSelect;
