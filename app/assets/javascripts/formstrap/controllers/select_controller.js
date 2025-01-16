import { Controller } from '@hotwired/stimulus'
import TomSelect from 'tom-select'
import I18n from '../config/i18n'

export default class extends Controller {
  static values = {
    remoteUrl: String,
    remoteValue: String,
    remoteLabel: String,
    remoteQueryParam: String
  }

  connect () {
    if (this.isMultiple() || this.isTomSelect() || this.isRemote()) {
      this.initTomSelect()
    }
  }

  disconnect () {
    this.element.tomselect.destroy()
  }

  defaultOptions () {
    return {
      plugins: ['drag_drop', 'caret_position', 'input_autogrow'],
      persist: false,
      create: true,
      render: this.renderOptions()[I18n.locale]
    }
  }

  isMultiple () {
    return this.element.hasAttribute('multiple')
  }

  isTomSelect () {
    return this.element.dataset.tomSelect === 'true'
  }

  isRemote () {
    return this.remoteUrlValue
  }

  defaultLoadOptions () {
    return (query, callback) => {
      if (!query.length) return callback()

      fetch(`${this.remoteUrlValue}.json?${this.remoteQueryParamValue}=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => { callback(data) })
        .catch(() => { callback() })
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
      ...(this.isRemote() && {
        valueField: this.remoteValueValue,
        labelField: this.remoteLabelValue,
        searchField: this.remoteLabelValue,
        load: this.defaultLoadOptions()
      }
      )
    }

    /* eslint-disable no-new */
    new TomSelect(this.element, { ...defaultOptions, ...options })
  }
}
