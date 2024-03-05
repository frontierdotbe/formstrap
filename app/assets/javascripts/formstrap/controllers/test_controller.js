import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['fields', 'preview']
  }

  static get values () {
    return {
      url: String
    }
  }

  connect () {
    this.refresh()
  }

  refresh () {
    // Create an AJAX request
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.urlValue, false)

    // Submit the form data
    const formData = this.buildFormData()
    xhr.send(formData)

    // Handle the request
    this.handleRequest(xhr)
  }

  handleRequest (request) {
    // Handle the response
    if (request.status === 200) {
      this.updatePreview(request.responseText)
    } else {
      console.error('Upload failed')
    }
  }

  buildFormData () {
    // Get fields
    const fields = this.fieldsTarget

    // Build FormData
    const formData = new FormData()

    // Replace all occurrences of "page[blocks_attributes][0]" with "block"
    const regex = /page\[blocks_attributes\]\[\d+\]/g
    const replacement = 'block'
    const formElements = fields.querySelectorAll('input[name]:not([name$="[id]"]), select[name]:not([name$="[id]"]), textarea[name]:not([name$="[id]"]), button[name]:not([name$="[id]"])')
    formElements.forEach(function (element) {
      const currentName = element.getAttribute('name')
      const newName = currentName.replace(regex, replacement)
      formData.append(newName, element.value)
    })

    return formData
  }

  updatePreview (html) {
    const shadowRoot = this.previewShadowRoot()

    // Wrap the HTML in a div
    const wrapper = document.createElement('div')

    // Disable pointer events
    wrapper.classList.add('pe-none')

    // Insert new HTML
    wrapper.innerHTML = html

    // Empty the shadow root
    shadowRoot.innerHTML = ''

    // Append the wrapper
    shadowRoot.appendChild(wrapper)
  }

  previewShadowRoot () {
    const shadowRoot = this.previewTarget.shadowRoot

    if (shadowRoot !== null) {
      return shadowRoot
    } else {
      return this.previewTarget.attachShadow({ mode: 'open' })
    }
  }
}
