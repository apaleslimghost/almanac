import React, {Component} from 'react';
import {Form, Field, Select} from './form';
import OdreianDate from 'odreian-date';
import _ from 'lodash';
import PropTypes from 'prop-types';

const ageYearMaxValues = OdreianDate.ages
.slice(1)
.map((age, i) =>
	(new OdreianDate(OdreianDate.ageEpochs[age])).year[0].year
).concat([[1, Infinity]]);

const ageYearMaxes = _.zipObject(
	_.values(OdreianDate.ageAbbreviations),
	ageYearMaxValues
);

const initDate = {
	age: 'FH',
	year: 1,
	month: 1,
	date: 1,
	hour: 0,
	minute: 0,
};

export default class DatePicker extends Component {
	// static contextTypes = fieldLike;

	state = initDate;

	get date() {
		return OdreianDate.from(this.state);
	}

	render() {
		return <Form initialData={initDate} onChange={date => this.setState(date)}>
			<Field name='hour' type='number' value={this.state.hour} min={0} max={23} />
			:
			<Field name='minute' type='number' value={this.state.minute} min={0} max={59} />

			<Field name='date' type='number' value={this.state.date} min={1} max={30} />

			<Select name='month' value={this.state.month}>
				{OdreianDate.months.map(
					(month, i) => <option value={i + 1} key={i}>{month}</option>
				)}
			</Select>

			<Field name='year' type='number' value={this.state.year} min={1} max={ageYearMaxes[this.state.age]} />

			<Select name='age' value={this.state.age}>
				{_.map(OdreianDate.ageAbbreviations,
					(abbr, name) => <option value={abbr} key={abbr}>{name}</option>
				)}
			</Select>

			<div>{this.date.LLLL}</div>
		</Form>;
	}
};
