// returns date in mm/dd/yyyy form
const DateConverter = (date: string | undefined) => {
  if (!date) {
    return 'N/A'
  }
  return new Date(date).toLocaleDateString('en-US')
}

export default DateConverter
