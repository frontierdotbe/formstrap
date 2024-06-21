/* global crypto */
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
    const buttons = document.querySelectorAll(`[data-popup-target="button"][data-popup-id="repeater-buttons-${this.idValue}"]`)
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
    template = this.randomizeIds(template)

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

  randomizeIds (template) {
    const randomNumber = crypto.randomUUID().substring(0, 8)
    const pattern = `_${this.idValue}_`
    const regex = new RegExp(pattern, 'g')

    // Loop through each node in the template
    template.querySelectorAll('*').forEach(node => {
      // Replace attribute values
      for (const attribute of node.attributes) {
        if (attribute.value.includes(pattern)) {
          attribute.value = attribute.value.replace(pattern, randomNumber)
        }
      }

      // Replace template content
      if (node.nodeName === 'TEMPLATE' && node.innerHTML.includes(pattern)) {
        node.innerHTML = node.innerHTML.replace(regex, randomNumber)
      }

      
    })

    const medias = template.querySelectorAll(".mb-3");
    for (const media of medias) {
      media.outerHTML = media.outerHTML.replace(new RegExp("bbbbbbbb", 'g'), crypto.randomUUID().substring(0, 8))
    }

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
