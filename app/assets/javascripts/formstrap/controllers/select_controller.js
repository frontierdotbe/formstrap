import { Controller } from '@hotwired/stimulus'
import TomSelect from 'tom-select'
import I18n from '../config/i18n'

export default class extends Controller {
  static values = {
    selected: Array
  }
  
  connect () {
    if (this.element.hasAttribute('multiple') || this.element.dataset.tomSelect === 'true') {
      this.initTomSelect()
    }
  }

  defaultOptions () {
    return {
      plugins: ['drag_drop', 'caret_position', 'input_autogrow'],
      persist: false,
      create: true,
      render: this.renderOptions()[I18n.locale]
    }
  }

  renderOptions () {
    return {
      en: {
        option_create: function (data, escape) {
          return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>'
        },
        no_results: function (data, escape) {
          return '<div class="no-results">No results found</div>'
        }
      },
      nl: {
        option_create: function (data, escape) {
          return '<div class="create">Voeg <strong>' + escape(data.input) + '</strong> toe &hellip;</div>'
        },
        no_results: function (data, escape) {
          return '<div class="no-results">Geen resultaten gevonden</div>'
        }
      }
    }
  }

  hasTags () {
    return this.element.dataset.tags === 'true'
  }

  initTomSelect () {
    const defaultOptions = this.defaultOptions()
    const options = { 
      create: this.hasTags(),
      items: this.selectedValue
    }

    /* eslint-disable no-new */
    new TomSelect(this.element, { ...defaultOptions, ...options })
  }
}
