import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    url: String
  }

  connect () {
    this.button = this.element
    this.button.addEventListener('click', (event) => {
      event.preventDefault()
      this.handleButtonClick()
    })
  }

  handleButtonClick () {
    const form = this.form().cloneNode(true)
    const authenticityTokenInput = form.querySelector('input[name="authenticity_token"]')
    const newAuthenticityToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    const methodInput = form.querySelector('input[name="_method"]')

    // Remove [id] fields
    const idInputs = form.querySelectorAll('input[name$="[id]"], select[name$="[id]"], textarea[name$="[id]"], button[name$="[id]"]')
    idInputs.forEach((input) => {
      input.remove()
    })

    // Override the form and submit
    form.setAttribute('action', this.urlValue)
    form.setAttribute('target', '_blank')
    authenticityTokenInput.value = newAuthenticityToken
    methodInput.value = 'post'

    // Insert form in DOm
    document.body.appendChild(form)

    // Submit form
    form.submit()

    // Remove form
    document.body.removeChild(form)
  }

  form () {
    return this.button.closest('form')
  }
}