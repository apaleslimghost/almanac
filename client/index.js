import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import styled, {injectGlobal} from 'styled-components';
import {grey} from '@quarterto/colours';

import {Cards} from '../src/collections';

injectGlobal`
	body {
		margin: 0;
		font-family: system-ui;
	}
`;

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

const CardPrimitive = styled.div`
	border: 1px solid ${grey[5]};
	padding: 1em;
	border-radius: 2px;
`;

class Toggler extends Component {
	constructor(...args) {
		super(...args);
		this.state = {on: false};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState(({on}) => ({on: !on}));
	}

	render() {
		return this.state.on
			? <this.props.active toggle={this.toggle} {...this.props} />
			: <this.props.inactive toggle={this.toggle} {...this.props} />;
	}
}

const preventingDefault = fn => ev => {
	ev.preventDefault();
	fn(ev);
};

const EditCard = ({card, saveCard, toggle}) =>
	<Form
		onSubmit={data => {
			saveCard(data);
			if (toggle) toggle();
		}}
		initialData={card}
	>
		<Field name="title" />
		<Field name="text" />
		<button>{toggle ? '✓' : '+'}</button>
		{toggle && <button onClick={preventingDefault(toggle)}>×</button>}
	</Form>;

const ShowCard = ({card: {title, text}, toggle}) =>
	<div>
		{toggle && <button onClick={toggle}>Edit</button>}
		<h1>{title}</h1>
		<p>{text}</p>
	</div>;

const Card = props =>
	<CardPrimitive>
		<Toggler active={EditCard} inactive={ShowCard} {...props} />
	</CardPrimitive>;

const List = styled.div`
	display: grid;
	padding: 1em;
	grid-gap: 1em;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const CardList = ({cards, saveCard}) =>
	<List>
		{cards.map(card =>
			<Card key={card._id} card={card} saveCard={saveCard} />
		)}

		<EditCard card={{}} saveCard={saveCard} />
	</List>;

const App = createContainer(
	() => ({
		cards: Cards.find({}).fetch(),

		saveCard(card) {
			if (card._id) {
				Cards.update(card._id, card);
			} else {
				Cards.insert(card);
			}
		},
	}),
	CardList
);

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});
