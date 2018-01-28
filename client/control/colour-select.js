import React, {Component} from 'react';
import colours from '@quarterto/colours';
import styled from 'styled-components';
import Popover from './popover';

import {etched} from '../visual/primitives';
import {fieldLike} from './form';

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

class ColourSelect extends Component {
	static contextTypes = fieldLike;

	onSelect = colour => {
		const {name} = this.props;
		this.context.setFields({
			[name]: colour,
		});
		this.popover.close();
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
				colour={this.context.fields[this.props.name]}
				icon='ion-paintbrush'
				ref={p => this.popover = p}
			>
				<Swatch>
					{hues.map(this.row(4))}
					{hues.map(this.row(3))}
				</Swatch>
			</Popover>
		);
	}
}

export default ColourSelect;
