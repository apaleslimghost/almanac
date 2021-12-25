class DreamDate::Base < DreamDate::Formatter
	def initialize(timestamp)
		@timestamp = timestamp
	end

	def self.fromDateString(date)
		self.new(
			calculateTimestampFromString(date)
		)
	end

	def self.fromDateComponents(*components)
		self.new(
			calculateTimestampFromDateComponents(*components)
		)
	end

	def add(year: 0, week: 0, day: 0, hour: 0, minute: 0, second: 0)
		timestamp = @timestamp

		timestamp += second
		timestamp += self.class::SCHEMA.conversions.secondsInMinute * minute
		timestamp += self.class::SCHEMA.conversions.secondsInHour * hour
		timestamp += self.class::SCHEMA.conversions.secondsInDay * day
		timestamp += self.class::SCHEMA.conversions.secondsInWeek * week

		if year
			currentYear = yearIndex
			targetYear = currentYear + year

			if targetYear >= currentYear
				while currentYear < targetYear
					timestamp += self.class.secondsInYear(currentYear)
					currentYear += 1
				end
			else
				while currentYear > targetYear
					timestamp -= self.class.secondsInYear(currentYear)
					currentYear -= 1
				end
			end
		end

		self.class.new(timestamp)
	end

	def periodIndices
		self.class::SCHEMA.periods.filter_map do |index, period|
			index if year >= period.startYear && year <= period.endYear
		end
	end

	def periodNames
		periodIndices.map { self.class::SCHEMA.periods[_1].name }
	end

	def periodAbbreviations
		periodIndices.map { self.class::SCHEMA.periods[_1].abbr }
	end

	def periodLongNames
		periodIndices.map { self.class::SCHEMA.periods[_1].long }
	end

	def periodYears
		self.class::SCHEMA.periods.filter_map do |index, period|
			if year >= period.startYear && year <= period.endYear
				(year - period.startYear) + 1
			end
		end
	end

	def yearIndex
		counter = @timestamp
		yearIndex = 0

		while counter >= 0
			counter -= self.class.secondsInYear(yearIndex + 1)
			if counter >= 0
				yearIndex += 1
			end
		end

		yearIndex
	end

	def year
		yearIndex + 1
	end

	def fullyElapsedYears
		yearIndex - 1
	end

	def fullyElapsedLeapYears
		leapYearCount = self.class.countLeapYears yearIndex

		if isLeapYear
			leapYearCount - 1
		else
			leapYearCount
		end
	end

	def fullyElapsedNonLeapYears
		fullyElapsedYears - fullyElapsedLeapYears
	end

	def timestampMinusYears

	end
end
