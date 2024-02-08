import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'

export default class extends Controller {
  static get targets () {
    return ['item', 'template', 'thumbnails', 'modalButton', 'placeholder', 'count', 'editButton', 'validationInput']
  }

  connect () {
    document.addEventListener('mediaSelectionSubmitted', (event) => {
      if (event.detail.name === this.element.dataset.name) {
        this.selectItems(event.detail.items)
      }
    })

    // Init sorting
    if (this.hasSorting()) {
      this.initSortable()
    }

    this.validate()
  }

  // Actions
  destroy (event) {
    const item = event.currentTarget.closest('[data-media-target=\'item\']')
    this.destroyItem(item)
  }

  syncIds () {
    const ids = this.activeIds()

    this.modalButtonTargets.forEach((button) => {
      const sourceLocation = window.location.protocol + '//' + window.location.host
      const url = new URL(button.getAttribute('href'), sourceLocation)

      // Remove all ids[]
      url.searchParams.delete('ids[]')

      // Add new ids
      ids.forEach((id) => {
        url.searchParams.append('ids[]', id)
      })

      button.setAttribute('href', url.toString())
    })
  }

  // Methods
  initSortable () {
    Sortable.create(this.thumbnailsTarget, {
      handle: '.media-drag-sort-handle',
      onEnd: (event) => {
        this.resetPositions()
      }
    })
  }

  hasSorting () {
    return this.element.dataset.sort === 'true'
  }

  destroyItem (item) {
    this.removeItem(item)
    this.postProcess()
  }

  selectItems (items) {
    // Destroy all deselected items
    this.removeAllDeselectedItems(items)

    // Add all new selected items
    this.addNewItems(items)

    this.postProcess()
  }

  postProcess () {
    // Reset positions
    this.resetPositions()

    // Sync Ids
    this.syncIds()

    // Toggle placeholder
    this.togglePlaceholder()

    // Validate
    this.validate()
  }

  validate () {
    this.clearValidation()
    this.validateMinimum()
    this.validateMaximum()
  }

  clearValidation () {
    this.validationInputTarget.setCustomValidity('')
  }

  validateMinimum () {
    const count = this.activeItems().length
    if (count < this.minActiveItems()) {
      this.validationInputTarget.setCustomValidity(this.validationInputTarget.dataset.minMessage)
    }
  }

  validateMaximum () {
    const count = this.activeItems().length
    if (count > this.maxActiveItems()) {
      this.validationInputTarget.setCustomValidity(this.validationInputTarget.dataset.maxMessage)
    }
  }

  minActiveItems () {
    return parseInt(this.element.dataset.min, 10) || 0
  }

  maxActiveItems () {
    return parseInt(this.element.dataset.max, 10) || Infinity
  }

  resetPositions () {
    this.activeItems().forEach((item, index) => {
      const positionInput = item.querySelector('input[name*=\'position\']')
      if (positionInput) {
        positionInput.value = index
      }
    })
  }

  addNewItems (items) {
    const itemTargetIds = this.itemTargets.map((i) => { return parseInt(i.querySelectorAll('input')[1].value) })
    items.forEach((item) => {
      if (itemTargetIds.includes(item.blobId)) {
        // Do not add this item (as it is already present)
        return
      }

      this.addItem(item)
    })
  }

  addItem (item) {
    const currentItem = this.itemByBlobId(item.blobId)
    if (currentItem) {
      // (re-)enable if already exists
      this.enableItem(currentItem)
    } else {
      // Create if item doesn't exist yet
      this.createItem(item)
    }
  }

  togglePlaceholder () {
    if (this.activeItems().length > 0) {
      this.hidePlaceholder()
    } else {
      this.showPlaceholder()
    }
  }

  showPlaceholder () {
    this.placeholderTarget.classList.remove('d-none')
  }

  hidePlaceholder () {
    this.placeholderTarget.classList.add('d-none')
  }

  enableItem (item) {
    item.querySelector('input[name*=\'_destroy\']').value = false
    item.classList.remove('d-none')
  }

  createItem (item) {
    // Copy template
    const template = this.templateTarget
    const html = this.randomizeIds(template)
    this.thumbnailsTarget.insertAdjacentHTML('beforeend', html)

    // Set new values
    const newItem = this.itemTargets.pop()
    newItem.querySelector('input[name*="[blob_id]"]').value = item.blobId
    newItem.querySelector('input[name*="[_destroy]"]').value = false

    // Update edit button url
    const editButton = newItem.querySelector('[data-media-target="editButton"]')
    editButton.setAttribute('href', editButton.getAttribute('href').replace(':id', item.blobId))

    // Copy thumbnail
    const oldThumbnail = newItem.querySelector('.formstrap-thumbnail')
    const newThumbnail = item.thumbnail.cloneNode(true)
    oldThumbnail.parentNode.replaceChild(newThumbnail, oldThumbnail)
  }

  randomizeIds (template) {
    const regex = new RegExp(template.dataset.templateIdRegex, 'g')
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000)
    return template.innerHTML.replace(regex, randomNumber)
  }

  removeAllDeselectedItems (items) {
    this.removeDeselectedItems(items, this.itemTargets)
  }

  removeDeselectedItems (elements, items) {
    const returnedBlobIds = elements.map((e) => { return e.blobId })

    items.forEach((item) => {
      const blobId = parseInt(item.querySelectorAll('input')[1].value)
      if (returnedBlobIds.includes(blobId)) {
        // Do not delete this one
        return
      }

      this.removeItem(item)
    })
  }

  removeItem (item) {
    item.querySelector('input[name*=\'_destroy\']').value = 1
    item.classList.add('d-none')

    // Reset positions
    this.resetPositions()

    // Sync ids
    this.syncIds()

    // Toggle placeholder
    this.togglePlaceholder()
  }

  itemByBlobId (blobId) {
    return this.itemTargets.find((item) => {
      return item.querySelector('input[name*=\'blob_id\']').value === blobId
    })
  }

  activeItems () {
    return this.itemTargets.filter((item) => {
      return item.querySelector('input[name$=\'[_destroy]\']').value === 'false'
    })
  }

  activeIds () {
    return this.activeItems().map((item) => {
      return item.querySelector('input[name$=\'[blob_id]\']').value
    })
  }
}
