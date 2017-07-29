import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import Popover from './popover';
import {etched} from './primitives';
import {fieldLike} from './form';
import subscribe from '../src/subscribe';
import {getSelectValue} from './form';
import {Types} from '../src/collections';

class TypeSelect extends Component {
	static contextTypes = fieldLike;

	onSelect = ev => {
		const {name} = this.props;
		this.context.setState({
			[name]: getSelectValue(ev.target),
		});
		this.popover.close();
	};

	render() {
		return (
			<Popover
				colour={this.context.state.colour}
				icon='ion-arrow-swap'
				ref={p => this.popover = p}
			>
				<select defaultValue='' onChange={this.onSelect}>
					<option value='' disabled></option>
					{this.props.types.map(type =>
						<option key={type._id} value={type._id}>{type.name}</option>
					)}
				</select>
			</Popover>
		);
	}
}

export default createContainer(() => ({
	ready: subscribe('links.types'),
	types: Types.find().fetch(),
}), TypeSelect);
