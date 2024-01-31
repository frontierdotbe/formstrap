/* global CustomEvent */
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['idCheckbox', 'item', 'form', 'selectButton', 'placeholder', 'count', 'search', 'searchId']
  }

  static get values () {
    return { ids: Array }
  }

  connect () {
    this.validate()
    this.updateCount()
  }

  // Actions
  select () {
    this.dispatchSelectionEvent()
  }

  submitForm () {
    this.hidePlaceholder()
    this.triggerFormSubmission()
    this.search('')
  }

  inputChange (event) {
    this.handleIdsUpdate(event.target)
    this.updateCount()
  }

  // Methods
  hidePlaceholder () {
    this.placeholderTarget.classList.add('d-none')
  }

  search (string) {
    const search = this.searchTarget.querySelector("input[name='search']")
    search.value = string

    this.searchTarget.requestSubmit()
  }

  handleIdsUpdate (element) {
    if (element.checked) {
      const arr = this.idsValue
      arr.push(element.value)
      this.idsValue = arr
    } else {
      this.idsValue = this.idsValue.filter((value) => {
        return element.value !== value
      })
    }

    this.handleSearchdIdsUpdate()
  }

  itemTargetConnected (element) {
    this.updateItem(element.querySelector('input'))
  }

  updateItem (element) {
    const arr = this.idsValue

    if (arr.includes(element.value)) {
      element.checked = true
    } else {
      element.checked = false
    }
  }

  idsValueChanged () {
    for (const item of this.itemTargets) {
      this.updateItem(item.querySelector('input'))
    }
    this.validate()
  }

  dispatchSelectionEvent () {
    document.dispatchEvent(
      new CustomEvent(
        'mediaSelectionSubmitted',
        {
          detail: {
            name: this.element.dataset.name,
            items: this.renderItemsForEvent()
          }
        }
      )
    )
  }

  triggerFormSubmission () {
    this.formTarget.requestSubmit()
  }

  renderItemsForEvent () {
    return this.idsValue.map((item) => this.renderItemForEvent(item)).filter((i) => { return i !== undefined })
  }

  renderItemForEvent (item) {
    const id = parseInt(item)
    const blobId = `#blob_${id}`
    const element = this.element.querySelector(blobId)

    return {
      blobId: id,
      thumbnail: element ? element.querySelector('.h-thumbnail') : ''
    }
  }

  selectedItems () {
    return this.itemTargets.filter((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]')
      return checkbox.checked
    })
  }

  selectedItemsCount () {
    return this.idsValue.length
  }

  minSelectedItems () {
    return parseInt(this.element.dataset.min, 10) || 0
  }

  maxSelectedItems () {
    return parseInt(this.element.dataset.max, 10) || Infinity
  }

  validate () {
    if (this.isValid()) {
      this.enableSelectButton()
    } else {
      this.disableSelectButton()
    }
  }

  enableSelectButton () {
    this.selectButtonTarget.removeAttribute('disabled')
  }

  disableSelectButton () {
    this.selectButtonTarget.setAttribute('disabled', '')
  }

  isValid () {
    const count = this.selectedItemsCount()
    return count >= this.minSelectedItems() && count <= this.maxSelectedItems()
  }

  updateCount () {
    this.countTarget.innerHTML = this.selectedItemsCount()
  }

  handleSearchdIdsUpdate () {
    this.deleteSearchIdInputs()
    this.createSearchIdInputs()
  }

  deleteSearchIdInputs () {
    for (const searchId of this.searchIdTargets) {
      searchId.remove()
    }
  }

  createSearchIdInputs () {
    for (const id of this.idsValue) {
      this.createSearchIdInput(id)
    }
  }

  createSearchIdInput (value) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'ids[]'
    input.setAttribute('data-media-modal-target', 'searchId')
    input.value = value
    this.searchTarget.appendChild(input)
  }
}
