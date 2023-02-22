import { Controller } from '@hotwired/stimulus'
import TomSelect from 'tom-select'
import I18n from '../config/i18n'

export default class extends Controller {
  connect () {
    if (this.element.hasAttribute('multiple')) {
      this.initTomSelect()
    }
  }

  defaultOptions (locale) {
    const defaultOptions = {
      en: {
        render: {
          option_create: function (data, escape) {
            return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>'
          },
          no_results: function (data, escape) {
            return '<div class="no-results">No results found</div>'
          }
        }
      },
      nl: {
        render: {
          option_create: function (data, escape) {
            return '<div class="create">Voeg <strong>' + escape(data.input) + '</strong> toe &hellip;</div>'
          },
          no_results: function (data, escape) {
            return '<div class="no-results">Geen resultaten gevonden</div>'
          }
        }
      }
    }
    return defaultOptions[locale]
  }

  hasTags () {
    return this.element.dataset.tags === 'true'
  }

  initTomSelect () {
    const defaultOptions = this.defaultOptions(I18n.locale)
    const options = { create: this.hasTags() }

    /* eslint-disable no-new */
    new TomSelect(this.element, { ...defaultOptions, ...options })
  }
}
