/* global IntersectionObserver */
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['textarea', 'count']
  }

  connect () {
    onVisible(this.textareaTarget, () => { this.update() })
  }

  update () {
    this.resize()
    this.updateCount()
  }

  resize () {
    this.textareaTarget.style.height = 'auto'
    this.textareaTarget.setAttribute('style', 'height:' + (this.textareaTarget.scrollHeight) + 'px;overflow-y:hidden;')
  }

  updateCount () {
    if (this.textareaTarget.getAttribute('maxlength')) {
      this.updateCountLength()
    }
  }

  updateCountLength () {
    const currentLength = this.textareaTarget.value.length
    const maximumLength = this.textareaTarget.getAttribute('maxlength')

    this.countTarget.textContent = `${currentLength}/${maximumLength}`
  }
}

// Custom callback event that triggers when an element becomes visible.
// Solves the bug where textarea fields are not properly sized when they (or their parent) or hidden.
function onVisible (element, callback) {
  new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        callback(element)
        observer.disconnect()
      }
    })
  }).observe(element)
}
