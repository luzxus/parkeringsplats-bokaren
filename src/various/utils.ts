const currentDate = new Date()
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formattedDate = `${daysOfWeek[currentDate.getDay()]} ${
  months[currentDate.getMonth()]
} ${currentDate.getDate()} ${currentDate.getFullYear()}`

export const getCurrentDate = () => {
  return formattedDate
}
