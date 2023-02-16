/* global RedactorX */
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect () {
    this.initRedactor()
  }

  initRedactor () {
    if (typeof RedactorX === 'undefined') {
      console.error('RedactorX is a paid module and is not included in Headmin. Please purchase it and import it as a JS module')
      return false
    }

    const defaultOptions = {
      editor: {
        minHeight: '57px'
      },
      subscribe: {
        'app.start': () => {
          this.stylize()
        }
      }
    }
    const options = JSON.parse(this.element.getAttribute('data-redactor-options'))
    RedactorX(this.element, { ...defaultOptions, ...options })
  }

  stylize () {
    const container = this.element.nextElementSibling

    // Copy textarea classes
    const inputClasses = this.element.classList
    container.classList.add(...inputClasses)

    // Add top margin to input group
    // const inputGroup = container.closest('.input-group')
    // inputGroup.classList.add('mt-4')
  }
}
