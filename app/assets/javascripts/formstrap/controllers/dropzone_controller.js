import { Controller } from '@hotwired/stimulus'

// References:
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

export default class extends Controller {
  static get targets () {
    return ['input']
  }

  connect () {
    // Drag
    this.inputTarget.addEventListener('dragover', (event) => {
      this.element.classList.add('focus')
    })
    this.inputTarget.addEventListener('dragleave', (event) => {
      this.element.classList.remove('focus')
    })
    this.inputTarget.addEventListener('drop', (event) => {
      this.element.classList.remove('focus')
    })

    // Focus
    this.inputTarget.addEventListener('focusin', (event) => {
      this.element.classList.add('focus')
    })
    this.inputTarget.addEventListener('focusout', (event) => {
      this.element.classList.remove('focus')
    })
  }
}
