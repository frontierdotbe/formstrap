import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['fields', 'preview', 'previewContent', 'offcanvas']
  }

  static get values () {
    return {
      url: String
    }
  }

  connect () {
    this.prepareIframe()
    this.resizeIframe()

    // Resize iFrame after content is loaded
    this.previewContentTarget.addEventListener('load', () => {
      this.resizeIframe()
    })

    // Preview on form change
    this.offcanvasTarget.addEventListener('hidden.bs.offcanvas', () => {
      this.requestPreview()
    })
  }

  requestPreview () {
    // Create an AJAX request
    // eslint-disable-next-line no-undef
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.urlValue, true)

    // Submit the form data
    const formData = this.buildFormData()
    xhr.send(formData)

    // Handle the request once it's done
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.handleRequest(xhr)
      }
    }
  }

  handleRequest (request) {
    // Handle the response
    if (request.status === 200) {
      this.updatePreview(request.responseText)
    } else {
      console.error('Preview request failed')
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

    // Add authenticity token
    formData.append('authenticity_token', this.getAuthenticityToken())

    return formData
  }

  // Prepare the iFrame for rendering
  // Objective: render the iframe content at the scale of the browser window, but resize it to fit the preview container
  prepareIframe () {
    const scaleFactor = this.scaleFactor()
    const style = `
      transform: scale(${scaleFactor}); 
      opacity: 0;
      transform-origin: 0 0; 
      width: ${100 / scaleFactor}%;
    `
    this.previewContentTarget.setAttribute('style', style)
  }

  // Relative size of the preview container compared to the browser window
  scaleFactor () {
    const width = this.previewTarget.getBoundingClientRect().width
    const viewportWidth = window.innerWidth
    return (width / viewportWidth).toFixed(1)
  }

  // Replace the body of the iframe with the new content
  updatePreview (html) {
    this.previewContentTarget.contentWindow.document.body.innerHTML = html
    this.resizeIframe()
  }

  // Dynamically resize the iFrame to fit its content
  resizeIframe () {
    const scaleFactor = this.scaleFactor()
    const iframeContentHeight = this.previewContentTarget.contentWindow.document.body.scrollHeight
    const iframeHeight = iframeContentHeight * scaleFactor
    this.previewContentTarget.style.height = iframeContentHeight + 'px'
    this.previewContentTarget.style.opacity = 1
    this.previewTarget.style.height = iframeHeight + 'px'
  }

  getAuthenticityToken () {
    const tokenTag = document.querySelector('meta[name="csrf-token"]')
    return tokenTag.getAttribute('content')
  }
}
