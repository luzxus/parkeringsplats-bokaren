import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DateRangePickerProps {
  onRangeChange: (startDate: Date, endDate: Date) => void
  startDate: Date | null
  endDate: Date | null
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleRangeChange = (dates: any) => {
    const [start, end] = dates

    if (start) {
      start.setHours(0, 0, 0, 0)
    }

    if (end) {
      end.setHours(23, 59, 0, 0)
    }

    setStartDate(start)
    setEndDate(end)
    onRangeChange(start, end)
  }

  return (
    <DatePicker
      locale="se"
      allowSameDay={true}
      calendarStartDay={1}
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      onChange={handleRangeChange}
      placeholderText="Välj datum för bokningen ska gälla"
    />
  )
}

export default DateRangePicker
