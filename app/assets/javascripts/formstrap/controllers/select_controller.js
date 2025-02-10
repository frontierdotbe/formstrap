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

  initialize () {
    this.tomSelect = undefined
    this.perPage = 24
    this.lastResponseLength = 0
  }

  connect () {
    if (this.isMultiple() || this.isTomSelect() || this.isRemote()) {
      this.tomSelect = this.initTomSelect()
    }
  }

  disconnect () {
    if (this.element.tomselect) {
      this.element.tomselect.destroy()
    }
  }

  defaultOptions () {
    return {
      plugins: {
        caret_position: {},
        drag_drop: {},
        input_autogrow: {}
      },
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

  setQueryParam (url, key, value) {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    // Adds if not exists, updates if exists
    params.set(key, value)

    return urlObj.toString()
  }

  getQueryParam (url, key) {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    return params.get(key)
  }

  firstUrl () {
    return (query) => {
      let url = `${this.remoteUrlValue}.json`
      url = this.setQueryParam(url, this.remoteQueryParamValue, query)
      url = this.setQueryParam(url, 'per_page', this.perPage)
      url = this.setQueryParam(url, 'page', 1)
      return url
    }
  }

  load () {
    return (query, callback) => {
      let url = this.tomSelect.getUrl(query)

      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (json.length === this.perPage) {
            // Update page param for next call
            const currentPage = parseInt(this.getQueryParam(url, 'page')) || 1
            url = this.setQueryParam(url, 'page', currentPage + 1)
            this.tomSelect.setNextUrl(query, url)
          } else {
            this.tomSelect.setNextUrl(query, undefined)
          }

          callback(json)
        })
        .catch(() => { callback() })
    }
  }

  renderOptions () {
    return {
      en: {
        option_create: function (data, escape) {
          return `<div class="create">Add <strong>${escape(data.input)}</strong>&hellip;</div>`
        },
        no_results: function (data, escape) {
          return '<div class="no-results">No results found</div>'
        },
        loading_more: function (data, escape) {
          return '<div class="loading-more-results">Loading more results ... </div>'
        },
        no_more_results: function (data, escape) {
          return '<div class="no-more-results">No more results</div>'
        }
      },
      nl: {
        option_create: function (data, escape) {
          return `<div class="create">Voeg <strong>${escape(data.input)}</strong> toe &hellip;</div>`
        },
        no_results: function (data, escape) {
          return '<div class="no-results">Geen resultaten gevonden</div>'
        },
        loading_more: function (data, escape) {
          return '<div class="loading-more-results">Laad meer resultaten ... </div>'
        },
        no_more_results: function (data, escape) {
          return '<div class="no-more-results">Geen resultaten meer</div>'
        }
      },
      fr: {
        option_create: function (data, escape) {
          return `<div class="create">Ajouter <strong>${escape(data.input)}</strong>&hellip;</div>`;
        },
        no_results: function (data, escape) {
          return '<div class="no-results">Aucun résultat trouvé</div>';
        },
        loading_more: function (data, escape) {
          return '<div class="loading-more-results">Chargement de plus de résultats ... </div>';
        },
        no_more_results: function (data, escape) {
          return '<div class="no-more-results">Plus de résultats</div>';
        }
      },
      de: {
        option_create: function (data, escape) {
          return `<div class="create">Hinzufügen <strong>${escape(data.input)}</strong>&hellip;</div>`;
        },
        no_results: function (data, escape) {
          return '<div class="no-results">Keine Ergebnisse gefunden</div>';
        },
        loading_more: function (data, escape) {
          return '<div class="loading-more-results">Lade weitere Ergebnisse ... </div>';
        },
        no_more_results: function (data, escape) {
          return '<div class="no-more-results">Keine weiteren Ergebnisse</div>';
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
        plugins: {
          caret_position: {},
          drag_drop: {},
          input_autogrow: {},
          virtual_scroll: {}
        },
        valueField: this.remoteValueValue,
        labelField: this.remoteLabelValue,
        searchField: this.remoteLabelValue,
        firstUrl: this.firstUrl(),
        load: this.load(),
        // Infinite options
        maxOptions: null,
        // Fetch first items when focused
        onFocus: () => {
          this.tomSelect.clearOptions()
          this.tomSelect.setNextUrl('', this.firstUrl()(''))
          this.tomSelect.load('')
        }
      })
    }

    return new TomSelect(this.element, { ...defaultOptions, ...options })
  }
}
