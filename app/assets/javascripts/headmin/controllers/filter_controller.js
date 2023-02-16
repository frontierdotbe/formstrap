import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['button', 'popup', 'conditional', 'operator', 'value', 'hidden', 'wrapper', 'template', 'row']
  }

  static get values () {
    return {
      name: String
    }
  }

  // Attaches controller logic to the element itself
  // This allows calling controller methods from the element in other controllers
  connect () {
    this.element.controller = this
  }

  toggle (event) {
    const expanded = this.buttonTarget.getAttribute('aria-expanded') === 'true'
    if (expanded) {
      this.close(null)
    } else {
      this.open()
    }
  }

  open () {
    this.buttonTarget.setAttribute('aria-expanded', 'true')
    this.popupTarget.classList.remove('closed')
  }

  close (event) {
    this.buttonTarget.setAttribute('aria-expanded', 'false')
    this.popupTarget.classList.add('closed')
  }

  add (event) {
    event.preventDefault()
    const html = this.getTemplateHTML()
    this.wrapperTarget.insertAdjacentHTML('beforeend', html)
  }

  remove (event) {
    event.preventDefault()
    const inputGroup = event.currentTarget.closest('[data-filter-target="row"]')
    // Check if there is a previous element (the conditional select). If no element (first inputGroup), take the next element.
    const conditional = inputGroup.previousElementSibling != null ? inputGroup.previousElementSibling : inputGroup.nextElementSibling

    inputGroup.remove()
    // If there is only one inputGroup, the conditional is null, so do not attempt to remove it
    if (conditional != null) conditional.remove()

    // After we remove the UI, run update to also remove filter from the hidden input
    this.updateHiddenValue()

    // Check if there are still inputs left, else remove filter
    if (this.valueTargets.length === 0) {
      this.removeFilter()
    }
  }

  removeFilter () {
    const form = this.buttonTarget.closest('form')
    this.buttonTarget.remove()
    this.popupTarget.remove()
    form.submit()
  }

  isClickedInside (event) {
    if (!event) {
      return false
    }
    const inPopup = this.popupTarget.contains(event.target)
    const inButton = this.buttonTarget.contains(event.target)
    const inAddButton = event.target.dataset.action === 'click->filters#add'
    return (inPopup || inButton || inAddButton)
  }

  updateHiddenValue () {
    this.hiddenTarget.value = this.buildInstructionString()
  }

  buildInstructionString () {
    let string = ''
    for (const row of this.rowTargets) {
      const conditional = row.previousElementSibling ? row.previousElementSibling.querySelector('[data-filter-target="conditional"]').value : null
      const operator = row.querySelector('[data-filter-target="operator"]').value
      let values = Array.from(row.querySelectorAll('[data-filter-target="value"]'))

      // Only the visible elements are of interest
      values = values.filter((element) => {
        return element.style.display
      })

      // Grab the value of each visible element
      values = values.map((element) => {
        return element.value
      })

      // Concatenate array to a string
      const value = values.join(',')

      string += `${conditional || ''}${operator}:${value}`
    }

    return string
  }

  getTemplateHTML () {
    const template = this.templateTarget
    return template.innerHTML
  }
}
