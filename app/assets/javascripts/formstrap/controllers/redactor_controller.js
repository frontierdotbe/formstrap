/* global Redactor */
import { Controller } from '@hotwired/stimulus'
import 'redactor'

export default class extends Controller {
  connect () {
    this.initRedactor()
  }

  initRedactor () {
    if (typeof Redactor === 'undefined') {
      console.error('Redactor is a paid module and is not included in Headmin. Please purchase it and import it as a JS module')
      return false
    }

    const options = JSON.parse(this.element.getAttribute('data-redactor-options'))
    Redactor(this.element, options)
  }
}
