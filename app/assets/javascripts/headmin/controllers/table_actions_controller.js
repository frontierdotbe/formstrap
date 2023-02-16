import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['wrapper', 'form', 'select', 'method', 'button', 'idInput', 'counter']
  }

  connect () {
    this.wrapperTarget.addEventListener('idSelectionChanged', (event) => {
      this.updateIdInput(event.detail.ids)
      this.updateCounter(event.detail.count)
      this.toggleCounter(event.detail.count)
    })
  }

  update (event) {
    event.preventDefault()
    this.updateFormAction()
    this.updateFormMethod()
    this.updateFormDataAttributes()
    this.enableButton()
  }

  updateIdInput (ids) {
    if (ids == null) {
      this.disableIdInput()
      this.idInputTarget.value = ''
    } else {
      this.enableIdInput()
      this.idInputTarget.value = `in:${ids.join(',')}`
    }
  }

  disableIdInput () {
    this.idInputTarget.removeAttribute('name')
  }

  enableIdInput () {
    this.idInputTarget.setAttribute('name', 'id')
  }

  updateCounter (count) {
    let htmlString = ''
    switch (count) {
      case 0:
        htmlString = this.counterTarget.getAttribute('data-items-zero')
        break
      case 1:
        htmlString = this.counterTarget.getAttribute('data-items-one')
        break
      default:
        htmlString = this.counterTarget.getAttribute('data-items-other')
        htmlString = htmlString.replace(/<b>[\s\S]*?<\/b>/, `<b>${count}</b>`)
    }
    this.counterTarget.innerHTML = htmlString
  }

  toggleCounter (count) {
    if (count > 0) {
      this.wrapperTarget.classList.remove('d-none')
    } else {
      this.wrapperTarget.classList.add('d-none')
    }
  }

  updateFormAction () {
    this.formTarget.action = this.selectTarget.value
  }

  updateFormMethod () {
    const option = this.selectedOption()
    this.methodTarget.value = option.dataset.method
  }

  updateFormDataAttributes () {
    const option = this.selectedOption()
    this.updateFormDataConfirm(option.dataset.turboConfirm)
    this.updateFormDataTurbo(option.dataset.turbo)
  }

  updateFormDataConfirm (confirm) {
    if (confirm) {
      this.formTarget.dataset.turboConfirm = confirm
    } else {
      this.formTarget.removeAttribute('data-turbo-confirm')
    }
  }

  updateFormDataTurbo (turbo) {
    if (turbo) {
      this.formTarget.dataset.turbo = turbo
    } else {
      this.formTarget.removeAttribute('data-turbo')
    }
  }

  selectedOption () {
    return this.selectTarget.options[this.selectTarget.selectedIndex]
  }

  enableButton () {
    this.buttonTarget.removeAttribute('disabled')
  }
}
