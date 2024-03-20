import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'

export default class extends Controller {
  static get values () {
    return {
      id: String
    }
  }

  static get targets () {
    return ['repeater', 'footer', 'template', 'row', 'list', 'empty', 'addButton']
  }

  connect () {
    Sortable.create(this.listTarget, {
      animation: 150,
      ghostClass: 'list-group-item-dark',
      draggable: '.formstrap-repeater-row',
      handle: '.formstrap-repeater-row-handle',
      onEnd: () => {
        this.resetIndices()
        this.resetPositions()
      }
    })

    this.toggleEmpty()
  }

  resetButtonIndices (event) {
    const row = event.target.closest('.formstrap-repeater-row')
    const index = this.containsRow(row) ? row.dataset.rowIndex : ''
    this.updatePopupButtonIndices(index)
  }

  containsRow (row) {
    return this.rowTargets.includes(row)
  }

  updatePopupButtonIndices (index) {
    const popup = document.querySelector(`[data-popup-target="popup"][data-popup-id="repeater-buttons-${this.idValue}"]`)
    const buttons = popup.querySelectorAll('[data-popup-target="button"]')
    buttons.forEach((button) => {
      button.dataset.rowIndex = index
    })
  }

  addRow (event) {
    event.preventDefault()
    const button = event.target
    const templateName = button.dataset.templateName
    const rowIndex = button.dataset.rowIndex

    // Prepare html from template
    let template = this.getTemplate(templateName).content.cloneNode(true)
    template = this.replaceIdsWithTimestamps(template)

    // Fallback to last row if no index is set
    if (rowIndex) {
      // Insert new row after defined row
      const row = this.rowTargets[rowIndex]
      this.listTarget.insertBefore(template, row.nextSibling)
    } else {
      // Insert before footer
      this.listTarget.insertBefore(template, this.footerTarget)
    }

    this.resetIndices()
    this.resetPositions()
    this.toggleEmpty()
  }

  removeRow (event) {
    event.preventDefault()

    const row = event.target.closest('.formstrap-repeater-row')

    if (row.dataset.newRecord === 'true') {
      // New records are simply removed from the page
      row.remove()
    } else {
      // Existing records are hidden and flagged for deletion
      this.flagRowForDeletion(row)
      row.remove()
    }

    this.resetIndices()
    this.resetPositions()
    this.toggleEmpty()
  }

  flagRowForDeletion (row) {
    const destroyInput = row.querySelector('input[name*=\'_destroy\']')
    const idInput = row.querySelector('input[name*=\'[id]\']')

    // Update _destroy value
    destroyInput.value = 1

    // Move away from row
    this.listTarget.parentNode.appendChild(destroyInput)
    this.listTarget.parentNode.appendChild(idInput)
  }

  getTemplate (name) {
    return this.templateTargets.filter((template) => {
      return template.dataset.templateName === name
    })[0]
  }

  replaceIdsWithTimestamps (template) {
    const pattern = 'rrrrrrrrr'
    const replacement = new Date().getTime().toString()
    const regex = new RegExp(pattern, 'g')

    // Replace ids
    template.querySelectorAll(`input[id*="${pattern}"], select[id*="${pattern}"], textarea[id*="${pattern}"], button[id*="${pattern}"]`).forEach((node) => {
      const idValue = node.getAttribute('id')
      node.setAttribute('id', idValue.replace(pattern, replacement))
    })

    // Search and replace pattern in templates
    template.querySelectorAll('template').forEach((node) => {
      node.innerHTML = node.innerHTML.replace(regex, replacement)
    })

    // Replace labels
    template.querySelectorAll(`label[for*="${pattern}"]`).forEach((node) => {
      const forValue = node.getAttribute('for')
      node.setAttribute('for', forValue.replace(pattern, replacement))
    })

    // Replace names
    template.querySelectorAll(`input[name*="${pattern}"], select[name*="${pattern}"], textarea[name*="${pattern}"], button[name*="${pattern}"]`).forEach((node) => {
      const nameValue = node.getAttribute('name')
      node.setAttribute('name', nameValue.replace(pattern, replacement))
    })

    // Replace offcanvas targets
    template.querySelectorAll(`div[data-bs-target="#offcanvas-${pattern}"]`).forEach((node) => {
      const targetValue = node.getAttribute('data-bs-target')
      node.setAttribute('data-bs-target', targetValue.replace(pattern, replacement))
    })

    // Replace offcanvas ids
    template.querySelectorAll(`.offcanvas[id="offcanvas-${pattern}"]`).forEach((node) => {
      const idValue = node.getAttribute('id')
      node.setAttribute('id', idValue.replace(pattern, replacement))
    })

    return template
  }

  visibleRowsCount () {
    return this.visibleRows().length
  }

  visibleRows () {
    const rows = this.rowTargets
    return rows.filter((row) => {
      return row.querySelector('input[name*=\'_destroy\']').value !== '1'
    })
  }

  toggleEmpty () {
    if (this.visibleRowsCount() > 0) {
      this.emptyTarget.classList.add('invisible')
    } else {
      this.emptyTarget.classList.remove('invisible')
    }
  }

  resetPositions () {
    this.visibleRows().forEach((row, index) => {
      const positionInput = row.querySelector('input[name*=\'position\']')
      if (positionInput) {
        positionInput.value = index
      }
    })
  }

  resetIndices () {
    this.visibleRows().forEach((row, index) => {
      row.dataset.rowIndex = index
    })
  }
}
