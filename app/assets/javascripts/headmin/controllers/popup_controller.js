/* global HTMLInputElement */
import { Controller } from '@hotwired/stimulus'
import { createPopper } from '@popperjs/core'

export default class extends Controller {
  static get targets () {
    return ['popup', 'button']
  }

  static get values () {
    return { id: String }
  }

  connect () {
    // Clicked outside popup
    document.addEventListener('click', (event) => {
      this.handleOutsideClick(event)
    })
  }

  handleOutsideClick (event) {
    const itemRemoved = !document.body.contains(event.target) // Ignore items that were removed from DOM (else this triggers a close)
    if (itemRemoved) return

    const inPopup = event.target.closest('[data-popup-target="popup"]') !== null
    const inButton = event.target.closest('[data-popup-target="button"]') !== null
    const openPopup = document.querySelector('[data-popup-target="popup"]:not(.closed)')

    if (!inButton && !inPopup && openPopup) {
      this.closePopup(openPopup)
    }
  }

  open (event) {
    const button = event.target.closest('[data-popup-target="button"]')
    const popup = this.popupById(button.dataset.popupId)
    const passThru = button.dataset.popupPassThru

    // Open the popup
    createPopper(button, popup)
    this.openPopup(popup)

    if (passThru) {
      // Pass click event to an element inside the popup
      const passThruElement = popup.querySelector(passThru)
      passThruElement.click()

      // Focus and select value if it's an input element
      if (passThruElement instanceof HTMLInputElement) {
        passThruElement.focus()
        passThruElement.select()
      }
    }
  }

  close (event) {
    const button = event.target.closest('[data-popup-target="button"]')
    const popup = this.popupById(button.dataset.popupId)
    this.closePopup(popup)
  }

  popupById (id) {
    return this.popupTargets.find((popup) => {
      return popup.dataset.popupId === id
    })
  }

  openPopup (popup) {
    popup.classList.remove('closed')
  }

  closePopup (popup) {
    popup.classList.add('closed')
  }
}
