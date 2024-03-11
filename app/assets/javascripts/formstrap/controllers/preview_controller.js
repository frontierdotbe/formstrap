import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    url: String
  }

  connect () {
    this.button = this.element
    this.button.addEventListener('click', (event) => {
      event.preventDefault()
      this.requestPreview()
    })
  }

  requestPreview () {
    const form = this.buildFakeForm()

    // Insert in DOM
    document.body.appendChild(form)

    // Submit form
    form.submit()

    // Remove from DOM
    document.body.removeChild(form)
  }

  buildFakeForm () {
    const form = this.form().cloneNode(true)

    // Empty [id] fields
    const idInputs = form.querySelectorAll('input[name$="[id]"], select[name$="[id]"], textarea[name$="[id]"], button[name$="[id]"]')
    idInputs.forEach((input) => {
      input.value = ''
    })

    // Set preview action
    form.setAttribute('action', this.urlValue)

    // Set target to blank
    form.setAttribute('target', '_blank')

    // Refresh authenticity token
    const authenticityTokenInput = form.querySelector('input[name="authenticity_token"]')
    authenticityTokenInput.value = this.getAuthenticityToken()

    // Remove method input if present (to force POST)
    form.querySelector('input[name="_method"]')?.remove()

    // Ensure POST method
    form.setAttribute('method', 'POST')

    return form
  }

  getAuthenticityToken () {
    const tokenTag = document.querySelector('meta[name="csrf-token"]')
    return tokenTag.getAttribute('content')
  }

  form () {
    return this.button.closest('form')
  }
}
