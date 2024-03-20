import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['fields', 'iframeWrapper', 'iframe', 'offcanvas', 'error', 'loader']
  }

  static get values () {
    return {
      url: String
    }
  }

  connect () {
    this.prepareIframe()

    // Resize iFrame after content is loaded
    this.iframeTarget.addEventListener('load', () => {
      this.hideLoader()
      this.resizeIframe()
      this.autoResizeIframe()
    })

    // Offcanvas closes
    this.offcanvasTarget.addEventListener('hide.bs.offcanvas', (event) => {
      if (!this.update()) {
        event.preventDefault()
      }
    })
  }

  autoResizeIframe () {
    // eslint-disable-next-line no-undef
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.resizeIframe()
      })
    })

    // Target the body of the iframe for observing
    const innerDoc = this.iframeTarget.contentWindow.document
    observer.observe(innerDoc.body, {
      childList: true, // Listen for additions/removals of child nodes
      subtree: true // Listen for changes in the whole subtree
    })
  }

  showLoader () {
    this.loaderTarget.classList.remove('d-none')
  }

  hideLoader () {
    this.loaderTarget.classList.add('d-none')
  }

  showError () {
    this.errorTarget.classList.remove('d-none')
  }

  hideError () {
    this.errorTarget.classList.add('d-none')
  }

  update () {
    // Validate fields
    const isValid = this.validateFields()

    if (isValid) {
      this.requestPreview()
      this.hideError()
      return true
    } else {
      this.showError()
      return false
    }
  }

  requestPreview () {
    // Create an AJAX request
    // eslint-disable-next-line no-undef
    const xhr = new XMLHttpRequest()
    xhr.open('POST', this.urlValue, true)

    // Submit the form data
    const formData = this.buildFormData()
    xhr.send(formData)

    // Show loader
    this.showLoader()

    // Handle the request once it's done
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.hideLoader()
        this.handleRequest(xhr)
      }
    }
  }

  handleRequest (request) {
    // Handle the response
    if (request.status === 200) {
      this.updatePreview(request.responseText)
    } else {
      this.showError()
    }
  }

  validateFields () {
    let allValid = true
    const fields = this.fieldsTarget
    const formElements = fields.querySelectorAll('input:not([type="hidden"]), select[name], textarea[name]')
    formElements.forEach(function (element) {
      const isValid = element.reportValidity()
      if (!isValid) {
        allValid = false
      }
    })
    return allValid
  }

  buildFormData () {
    // Get fields
    const fields = this.fieldsTarget

    // Build FormData
    const formData = new FormData()

    // Replace all occurrences of "page[blocks_attributes][0]" with "block"
    const regex = /\w+\[([^\]]+)s_attributes\]\[\d+\]/g
    const formElements = fields.querySelectorAll('input[name]:not([name$="[id]"]), select[name]:not([name$="[id]"]), textarea[name]:not([name$="[id]"]), button[name]:not([name$="[id]"])')
    formElements.forEach(function (element) {
      const currentName = element.getAttribute('name')
      const newName = currentName.replace(regex, '$1')
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
    this.iframeTarget.setAttribute('style', style)
  }

  // Relative size of the preview container compared to the browser window
  scaleFactor () {
    const width = this.iframeWrapperTarget.getBoundingClientRect().width
    const viewportWidth = window.innerWidth
    return parseFloat((width / viewportWidth).toFixed(1))
  }

  // Replace the body of the iframe with the new content
  updatePreview (html) {
    this.iframeTarget.contentWindow.document.body.innerHTML = html
    this.resizeIframe()
  }

  // Dynamically resize the iFrame to fit its content
  resizeIframe () {
    const scaleFactor = this.scaleFactor()
    const iframeContentHeight = this.iFrameContentHeight()
    const iframeHeight = iframeContentHeight * scaleFactor

    this.iframeTarget.style.height = `${iframeContentHeight.toFixed()}px`
    this.iframeTarget.style.opacity = 1
    this.iframeWrapperTarget.style.height = `${iframeHeight.toFixed()}px`
  }

  iFrameContentHeight () {
    const firstElement = this.iframeTarget.contentWindow.document.body.firstElementChild
    const firstElementStyle = window.getComputedStyle(firstElement)

    const height = firstElement.scrollHeight
    const margins = parseInt(firstElementStyle.marginTop) + parseInt(firstElementStyle.marginBottom)
    return height + margins
  }

  getAuthenticityToken () {
    const tokenTag = document.querySelector('meta[name="csrf-token"]')
    return tokenTag.getAttribute('content')
  }
}
