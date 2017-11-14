import React, {Component} from 'react';
import {Form, Field, Select as SelectField} from './form';
import OdreianDate from 'odreian-date';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {Input, Select, List} from './primitives';

const ageYearMaxValues = OdreianDate.ages
	.slice(1)
	.map((age, i) => new OdreianDate(OdreianDate.ageEpochs[age]).year[0].year)
	.concat(999);

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

const dateState = date => ({
	age: OdreianDate.ageAbbreviations[date.age[0]],
	year: date.year[0].year,
	month: date.M,
	date: date.D,
	hour: date.hour,
	minute: date.minute,
});

export default class DatePicker extends Component {
	state = this.dateFromTimestamp(this.props.timestamp);

	get date() {
		return OdreianDate.from(this.state);
	}

	componentWillReceiveProps({timestamp}) {
		this.setState(
			this.dateFromTimestamp(timestamp)
		);
	}

	dateFromTimestamp(timestamp) {
		return timestamp
			? dateState(new OdreianDate(timestamp))
			: initDate;
	}

	render() {
		return (
			<Form
				initialData={initDate}
				onChange={date =>
					this.setState(
						date,
						() => this.props.onChange && this.props.onChange(this.date)
					)}
			>
				<List>
					<Field
						tag={Input}
						name="hour"
						type="number"
						value={this.state.hour}
						min={0}
						max={23}
					/>
					:
					<Field
						tag={Input}
						name="minute"
						type="number"
						value={this.state.minute}
						min={0}
						max={59}
					/>
					<Field
						tag={Input}
						name="date"
						type="number"
						value={this.state.date}
						min={1}
						max={30}
					/>
					<SelectField tag={Select} name="month" value={this.state.month}>
						{OdreianDate.months.map((month, i) =>
							<option value={i + 1} key={i}>
								{month}
							</option>
						)}
					</SelectField>
					<Field
						tag={Input}
						name="year"
						type="number"
						value={this.state.year}
						min={1}
						max={ageYearMaxes[this.state.age]}
					/>
					<SelectField tag={Select} name="age" value={this.state.age}>
						{_.map(OdreianDate.ageAbbreviations, (abbr, name) =>
							<option value={abbr} key={abbr}>
								{name}
							</option>
						)}
					</SelectField>
				</List>
			</Form>
		);
	}
}
