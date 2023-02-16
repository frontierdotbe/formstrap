import { Controller } from '@hotwired/stimulus'
import { Toast } from 'bootstrap'

export default class extends Controller {
  connect () {
    /* eslint-disable no-new */
    new Toast(this.element, {})
  }
}
