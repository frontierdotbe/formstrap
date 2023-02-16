/* global CustomEvent, fetch, FormData */
import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'

export default class extends Controller {
  static get values () {
    return {
      url: String,
      count: Number
    }
  }

  static get targets () {
    return ['table', 'body', 'actions', 'idCheckbox', 'idsCheckbox', 'row']
  }

  connect () {
    Sortable.create(this.bodyTarget, {
      handle: '.table-drag-sort-handle',
      onEnd: (event) => {
        this.submitPositions()
      }
    })
  }

  submitPositions () {
    fetch(this.urlValue, {
      method: 'PATCH',
      body: this.idsFormData(),
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    }).then((response) => {
      return response.text()
    }).catch((err) => {
      console.warn('Fetch went wrong', err)
    })
  }

  positions () {
    const handles = [...this.tableTarget.querySelectorAll('.table-drag-sort-handle')]
    return handles.map((handle) => {
      return handle.dataset.id
    })
  }

  idsFormData () {
    const formData = new FormData()
    this.positions().forEach(id => {
      formData.append('ids[]', id)
    })
    return formData
  }

  toggleIds (event) {
    const checkbox = event.target
    this.toggleIdsCheckboxes(checkbox.checked)
    this.toggleIdCheckboxes(checkbox.checked)
    this.updateActions()
  }

  toggleId (event) {
    this.toggleIdsCheckboxes(false)
    this.updateActions()
  }

  updateActions () {
    this.actionsTarget.dispatchEvent(
      new CustomEvent(
        'idSelectionChanged',
        {
          detail: {
            ids: this.ids(),
            count: this.selectedIdsCount()
          }
        }
      )
    )
  }

  selectedIdsCount () {
    if (this.ids() instanceof Array) {
      return this.ids().length
    } else {
      return this.totalCount()
    }
  }

  totalCount () {
    if (this.countValue === 0) {
      return this.rowTargets.length
    } else {
      return this.countValue
    }
  }

  ids () {
    if (this.idsCheckboxTarget.checked) {
      return null
    } else {
      return this.selectedIdCheckboxes().map((checkbox) => {
        return checkbox.value
      })
    }
  }

  selectedIdCheckboxes () {
    return this.idCheckboxTargets.filter((checkbox) => {
      return checkbox.checked
    })
  }

  toggleIdsCheckboxes (checked) {
    this.idsCheckboxTargets.forEach((checkbox) => {
      checkbox.checked = checked
    })
  }

  toggleIdCheckboxes (checked) {
    this.idCheckboxTargets.forEach((checkbox) => {
      checkbox.checked = checked
    })
  }
}
