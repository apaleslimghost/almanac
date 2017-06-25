import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Cards} from '../src/collections';

const getValue = ev =>
	ev.target[
		{
			number: 'valueAsNumber',
			range: 'valueAsNumber',
			date: 'valueAsDate',
		}[ev.target.type] || 'value'
	];

class Field extends Component {
	static get contextTypes() {
		return {
			state: PropTypes.object,
			setState: PropTypes.func,
		};
	}

	render() {
		const {name} = this.props;
		return (
			<input
				type="text"
				{...this.props}
				value={this.context.state[name] || ''}
				onChange={ev => this.context.setState({[name]: getValue(ev)})}
			/>
		);
	}
}

class Form extends Component {
	constructor(props, ...args) {
		super(props, ...args);

		this.state = props.initialData;

		this.setState = this.setState.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	getChildContext() {
		return {
			state: this.state,
			setState: this.setState,
		};
	}

	static get childContextTypes() {
		return {
			state: PropTypes.object,
			setState: PropTypes.func,
		};
	}

	onSubmit(ev) {
		ev.preventDefault();
		this.props.onSubmit(this.state);
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				{this.props.children}
			</form>
		);
	}
}

const CardList = ({cards, insertCard}) =>
	<ul>
		{cards.map(card => <li key={card._id}>{card.text}</li>)}

		<Form onSubmit={insertCard} initialData={{text: ''}}>
			<Field name="text" />
			<button>+</button>
		</Form>
	</ul>;

const App = createContainer(
	() => ({
		cards: Cards.find({}).fetch(),
		insertCard(card) {
			Cards.insert(card);
		},
	}),
	CardList
);

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});
