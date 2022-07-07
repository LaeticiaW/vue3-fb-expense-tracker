export default {
  // Required field
  isRequired(val: string) {
    return (val && val.toString().length > 0) || 'Value is required'
  },

  // Date less than or equal to today
  isDateLeToday(val: string) {
    const dt = new Date(val).getTime()
    const today = new Date().getTime()
    return dt <= today
  },

  // Is number
  isNumber(val: number | string | boolean) {
    return typeof val === 'number' || 'Value must be a number'
  },
}
