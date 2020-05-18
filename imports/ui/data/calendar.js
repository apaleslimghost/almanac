import HarptosDate from 'dream-date/calendar/harptos'
import HarptosCommonDate from 'dream-date/calendar/harptos-common'
import OdreianDate from 'dream-date/calendar/odreian'
import TideDate from 'dream-date/calendar/tide'
import GregorianDate from 'dream-date/calendar/gregorian'
import { useCampaign } from './campaign'

export const calendars = {
	harptosV1: {
		name: 'Harptos',
		dateConstructor: HarptosDate,
	},
	harptosCommonV1: {
		name: 'Harptos (common)',
		dateConstructor: HarptosCommonDate,
	},
	odreianV1: {
		name: 'Odreian',
		dateConstructor: OdreianDate,
	},
	tideV1: {
		name: 'Tide',
		dateConstructor: TideDate,
	},
	gregorianV1: {
		name: 'Gregorian',
		dateConstructor: GregorianDate,
	},
}

const defaultCalendarId = 'odreianV1'

export const calendarList = Object.entries(calendars).map(([id, detail]) =>
	Object.assign({ id }, detail),
)

const getCampaignDateConstructor = calendarId =>
	(calendars[calendarId] || calendars[defaultCalendarId]).dateConstructor

export const useCampaignDate = () => {
	const { calendar } = useCampaign()
	return getCampaignDateConstructor(calendar)
}
