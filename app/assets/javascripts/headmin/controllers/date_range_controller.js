import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  update (event) {
    const flatpickr = event.target._flatpickr
    const startDate = flatpickr.selectedDates[0]
    const endDate = flatpickr.selectedDates[1]

    this.setStartDateInputValue(this.formatDate(startDate))
    this.setEndDateInputValue(this.formatDate(endDate))
  }

  setStartDateInputValue (value) {
    const startDateInput = this.startDateInput()
    startDateInput.value = value
  }

  setEndDateInputValue (value) {
    const endDateInput = this.endDateInput()
    endDateInput.value = value
  }

  startDateInput () {
    return this.element.nextElementSibling
  }

  endDateInput () {
    return this.startDateInput().nextElementSibling
  }

  formatDate (date) {
    if (date instanceof Date) {
      return date.toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } else {
      return null
    }
  }
}
