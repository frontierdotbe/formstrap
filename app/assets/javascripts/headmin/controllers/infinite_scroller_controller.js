import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect () {
    this.clickWhenInViewport()

    document.querySelector('.modal-body').addEventListener('scroll', () => {
      this.clickWhenInViewport()
    })
  }

  clickWhenInViewport () {
    if (!this.isLoading() && this.isInViewport()) {
      this.element.setAttribute('clicked', 1)
      this.element.click()
    }
  }

  isLoading () {
    return this.element.hasAttribute('clicked')
  }

  isInViewport () {
    const rect = this.element.getBoundingClientRect()

    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  }
}
