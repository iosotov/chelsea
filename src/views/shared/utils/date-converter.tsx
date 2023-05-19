import parseISO from 'date-fns/parseISO'
import { format, utcToZonedTime } from 'date-fns-tz'

// returns date in mm/dd/yyyy form
const DateConverter = (date: string | undefined, tz?: string) => {
  if (!date) {
    return 'N/A'
  }

  const parsedDate = parseISO(date)

  // if (date.indexOf('Z')) {
  //   console.log(date)
  //   const newDate = date.slice(0, date.indexOf('Z'))
  //   return format(new Date(newDate), 'P')
  // }

  //currently need to check for type of info coming in from api
  if (tz) return format(utcToZonedTime(parsedDate, tz), 'P')
  return format(new Date(date), 'P')
}

export default DateConverter
