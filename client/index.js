import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import styled, {injectGlobal} from 'styled-components';
import {grey} from '@quarterto/colours';
import _ from 'lodash';
import route from './router';

import {Cards} from '../src/collections';

injectGlobal`
	body {
		margin: 0;
		font-family: system-ui;
	}
`;

const getValue = el =>
	el[
		{
			number: 'valueAsNumber',
			range: 'valueAsNumber',
			date: 'valueAsDate',
		}[el.type] || 'value'
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
				onChange={ev =>
					this.context.setState({[name]: getValue(ev.target)})}
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

	static get defaultProps() {
		return {initialData: {}};
	}

	onSubmit(ev) {
		ev.preventDefault();
		Promise.resolve(this.props.onSubmit(this.state)).then(() => {
			this.state = this.props.initialData;
			this.forceUpdate();
		});
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

// TODO: related cards
// array of card ids
// fetch relatedcards by thing
// on delete find cards that had this as related and update

const selectValue = el => el.options[el.selectedIndex].value;

const CardSelect = ({cardsById, onSelect}) =>
	<select
		value=""
		onChange={ev => onSelect(cardsById[selectValue(ev.target)])}
	>
		<option disabled value="" />
		{_.map(cardsById, card =>
			<option key={card._id} value={card._id}>{card.title}</option>
		)}
	</select>;

const CardSelectContainer = createContainer(
	({skip}) => ({
		cardsById: _.keyBy(Cards.find({_id: {$nin: skip}}).fetch(), '_id'),
	}),
	CardSelect
);

const EditCard = ({card, saveCard, toggle, deleteCard}) =>
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
		{deleteCard &&
			<button onClick={preventingDefault(() => deleteCard(card))}>
				🗑
			</button>}
	</Form>;

const ShowCard = ({card, relatedCards, toggle, addRelated}) =>
	<div>
		{toggle && <button onClick={toggle}>Edit</button>}
		<h1>{card.title}</h1>
		<p>{card.text}</p>

		<ul>
			{relatedCards.map(related =>
				<li key={related._id}>{related.title}</li>
			)}
			<li>
				<CardSelectContainer
					onSelect={addRelated}
					skip={[card._id].concat(card.related || [])}
				/>
			</li>
		</ul>
	</div>;

const ShowCardContainer = createContainer(
	({card}) => ({
		relatedCards: Cards.find({_id: {$in: card.related || []}}).fetch(),
		addRelated(related) {
			Cards.update(card._id, {
				$addToSet: {related: related._id},
			});
		},
	}),
	ShowCard
);

const Card = props =>
	<CardPrimitive>
		<Toggler active={EditCard} inactive={ShowCardContainer} {...props} />
	</CardPrimitive>;

const List = styled.div`
	display: grid;
	padding: 1em;
	grid-gap: 1em;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const CardList = ({cards, saveCard, deleteCard}) =>
	<List>
		{cards.map(card =>
			<Card
				key={card._id}
				card={card}
				saveCard={saveCard}
				deleteCard={deleteCard}
			/>
		)}

		<CardPrimitive>
			<EditCard card={{}} saveCard={saveCard} />
		</CardPrimitive>
	</List>;

const CardListContainer = createContainer(
	() => ({
		cards: Cards.find({}).fetch(),

		saveCard(card) {
			if (card._id) {
				Cards.update(card._id, card);
			} else {
				Cards.insert(card);
			}
		},

		deleteCard(card) {
			Cards.remove(card._id);

			const relatedCards = Cards.find({related: card._id}).fetch();
			relatedCards.forEach(related => {
				Cards.update(related._id, {
					$pull: {related: card._id},
				});
			});
		},
	}),
	CardList
);

const App = createContainer(
	({router}) => ({
		page: router(),
	}),
	({page}) => page
);

const routes = route({
	'/': () => <CardListContainer />,
});

Meteor.startup(() => {
	render(<App router={routes} />, document.querySelector('main'));
});
