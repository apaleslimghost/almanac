import React, {Component, Children} from 'react';
import colours from '@quarterto/colours';
import {injectGlobal} from 'styled-components';
import BasePopover from 'react-popover';

import {LabelButton, Icon, shadow} from './primitives';
import preventingDefault from '../preventing-default';

injectGlobal`
.Popover-body {
	margin-top: -2px; /* move under the tip triangle */
	border: 1px solid ${colours.steel[3]};
	box-shadow: ${shadow(2)};
	background: white;
	padding: 3px;
	border-radius: 2px;
}

.Popover-tip {
	border-bottom: 1px solid white; /* cover the bottom stroke of the triangle */
}
.Popover-tipShape {
	stroke: ${colours.steel[3]};
	fill: white;
}
`;

class Popover extends Component {
	state = {
		isOpen: false,
	};

	close() {
		this.setState({isOpen: false});
	}

	render() {
		return (
			<BasePopover
				isOpen={this.state.isOpen}
				enterExitTransitionDurationMs={0}
				preferPlace='below'
				body={Children.only(this.props.children)}
			>
				<LabelButton
					{...this.props.colour}
					onClick={preventingDefault(() => this.setState({isOpen: !this.state.isOpen}))}
				>
					<Icon icon={this.props.icon} />
				</LabelButton>
			</BasePopover>
		);
	}
}

export default Popover;
