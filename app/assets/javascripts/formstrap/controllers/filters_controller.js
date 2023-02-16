import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['form', 'list', 'input', 'template', 'button', 'menuItem']
  }

  add (event) {
    event.preventDefault()
    const name = event.target.dataset.filterName
    const button = this.getButtonByName(name)
    if (button) {
      this.openFilter(button)
    } else {
      this.createFilter(name)
    }
  }

  createFilter (name) {
    let html = this.getTemplateHTML(name)
    html = this.replaceIdsWithTimestamps(html)
    this.listTarget.insertAdjacentHTML('beforeend', html)
  }

  remove (event) {
    const filter = event.currentTarget.closest('.h-filter')
    filter.remove()
    this.formTarget.submit()
  }

  removeAll (event) {
    this.listTarget.innerHTML = ''
    this.formTarget.submit()
  }

  update (event) {
    this.formTarget.submit()
  }

  getButtonByName (name) {
    return this.buttonTargets.find(function (element) {
      return element.dataset.filterName === name
    })
  }

  openFilter (button) {
    button.controller.open()
  }

  getTemplateHTML (name) {
    const template = this.templateTargets.filter((element) => {
      return element.dataset.filterName === name
    })[0]
    return template.innerHTML
  }

  replaceIdsWithTimestamps (html) {
    return html.replace(/template_id/g, new Date().getTime())
  }
}
