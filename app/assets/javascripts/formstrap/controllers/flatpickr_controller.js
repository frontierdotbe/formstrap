import { Controller } from '@hotwired/stimulus'
import flatpickr from 'flatpickr'
import { Dutch } from 'flatpickr/dist/esm/l10n/nl.js'
import I18n from '../config/i18n'

export default class extends Controller {
  connect () {
    const options = { ...this.defaultOptions(), ...this.options() }
    flatpickr(this.element, options)
  }

  options () {
    return JSON.parse(this.element.getAttribute('data-flatpickr'))
  }

  defaultOptions () {
    return {
      allowInput: true,
      dateFormat: 'd/m/Y',
      locale: this.getLocale(I18n.locale)
    }
  }

  getLocale (locale) {
    const locales = this.locales()
    return locales[locale]
  }

  locales () {
    return {
      en: null,
      nl: Dutch
    }
  }
}
