/* global fetch, Event */
import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['input', 'dropdown', 'dropdownItem']
  }

  static get values () {
    return {
      url: String
    }
  }

  connect () {
    // Focus
    this.inputTarget.addEventListener('focus', (event) => {
      this.show()
    })

    // Navigation
    this.inputTarget.addEventListener('keydown', (event) => {
      this.handleKeydown(event)
    })

    // Typing
    this.inputTarget.addEventListener('keyup', (event) => {
      this.handleKeyup(event)
    })

    // Clicked outside dropdown
    document.addEventListener('click', (event) => {
      this.handleOutsideClick(event)
    })
  }

  handleKeydown (event) {
    const keyCode = parseInt(event.keyCode, 10)
    if (this.isArrowKey(keyCode)) {
      this.handleArrowKey(keyCode)
    }

    if (this.isEnterKey(keyCode)) {
      this.selectActiveItem(event)
    }
  }

  handleKeyup (event) {
    // Ignore arrow keys or enters
    const keyCode = parseInt(event.keyCode, 10)
    if (this.isArrowKey(keyCode) || this.isEnterKey(keyCode)) {
      return false
    }

    this.handleTextKey()
  }

  selectActiveItem (event) {
    const activeItem = this.activeItem()
    if (activeItem) {
      this.deselectAll()
      this.setValue(activeItem.getAttribute('value'))
      event.preventDefault()
    }
  }

  isEnterKey (keyCode) {
    return keyCode === 13
  }

  handleArrowKey (keyCode) {
    this.show()
    switch (keyCode) {
      case 38:
        this.handleArrowUp()
        break
      case 40:
        this.handleArrowDown()
        break
      default:
    }
  }

  handleArrowUp () {
    this.selectPreviousItem()
  }

  handleArrowDown () {
    this.selectNextItem()
  }

  selectNextItem () {
    const next = this.nextItem()
    if (next) {
      this.deselectAll()
      next.classList.add('active')
    }
  }

  nextItem () {
    const current = this.activeItem()

    // Select first item if nothing selected
    if (!this.hasSelectedItem()) {
      return this.firstItem()
    }

    if (this.isItemLast(current)) {
      return this.firstItem()
    } else {
      const index = this.itemIndex(current)
      return this.itemAtIndex(index + 1)
    }
  }

  selectPreviousItem () {
    const previous = this.previousItem()
    if (previous) {
      this.deselectAll()
      previous.classList.add('active')
    }
  }

  previousItem () {
    const current = this.activeItem()

    // Select last item if nothing selected
    if (!this.hasSelectedItem()) {
      return this.lastItem()
    }

    if (this.isItemFirst(current)) {
      return this.lastItem()
    } else {
      const index = this.itemIndex(current)
      return this.itemAtIndex(index - 1)
    }
  }

  deselectAll () {
    this.dropdownItemTargets.forEach(dropdownItem => {
      dropdownItem.classList.remove('active')
    })
  }

  itemAtIndex (index) {
    return this.dropdownItemTargets[index]
  }

  firstItem () {
    return this.itemAtIndex(0)
  }

  lastItem () {
    return this.itemAtIndex(this.dropdownItemTargets.length - 1)
  }

  hasSelectedItem () {
    return this.activeItem() !== undefined
  }

  activeItem () {
    return this.dropdownItemTargets.find((item) => {
      return item.classList.contains('active')
    })
  }

  isItemLast (item) {
    return this.itemIndex(item) === this.dropdownItemTargets.length - 1
  }

  isItemFirst (item) {
    return this.itemIndex(item) === 0
  }

  itemIndex (item) {
    return Array.from(this.dropdownItemTargets).indexOf(item)
  }

  handleTextKey () {
    // 1. fetch info
    this.fetchCollection().then((html) => {
      // 2. render html
      this.renderCollection(html)
    }).then(() => {
      // 3. Highlight
      this.highlight()
    }).then(() => {
      // 4. Preselect first result
      this.activateFirstItem()
    }).then(() => {
      // 5. Show results
      this.show()
    })
  }

  activateFirstItem () {
    this.deselectAll()
    this.firstItem().classList.add('active')
  }

  show () {
    if (this.isDropdownEmpty()) {
      this.dropdownTarget.classList.remove('d-none')
    } else {
      this.hide()
    }
  }

  hide () {
    this.dropdownTarget.classList.add('d-none')
  }

  isDropdownEmpty () {
    return this.dropdownTarget.textContent.trim().length > 0
  }

  isArrowKey (keyCode) {
    const arrowKeyCodes = [37, 38, 39, 40]
    return arrowKeyCodes.includes(keyCode)
  }

  fetchCollection () {
    if (this.isRemote()) {
      return fetch(this.remoteURL()).then((response) => {
        return response.text()
      }).catch((error) => {
        console.error('The URL you provided for the autocomplete collection didn\'t return a successful result', error)
      })
    } else {
      return Promise.resolve(this.dropdownTarget.innerHTML)
    }
  }

  remoteURL () {
    // Set dummy base in case a relative path is provided as remote URL
    const base = 'https://example.com'
    const url = new URL(this.urlValue, base)

    // Update pagination params
    const params = new URLSearchParams(url.search)
    params.set('search', this.value())
    params.set('page', '1')
    params.set('per_page', '6')
    url.search = params.toString()

    // Convert to string
    let urlString = url.toString()

    // Convert back to relative url if needed
    if (urlString.includes(base)) {
      urlString = urlString.replace(base, '')
    }

    return urlString
  }

  renderCollection (html) {
    this.dropdownTarget.innerHTML = html
  }

  isRemote () {
    return this.hasUrlValue
  }

  highlight () {
    const query = this.value()
    this.dropdownItemTargets.forEach(dropdownItem => {
      let text = dropdownItem.innerHTML

      // Clean up past results
      text = text.replace(/<mark.*?>(.*?)<\/mark>/ig, '$1')

      // Highlight query
      if (query && query.length > 0) {
        // Ignore all strings inside < >
        const regex2 = new RegExp(`(?<!<[^>]*?)(&nbsp;)?(${query})`, 'gi')
        text = text.replace(regex2, '<mark>$2</mark>')
      }

      dropdownItem.innerHTML = text
    })
  }

  select (event) {
    this.setValue(event.currentTarget.getAttribute('value'))
  }

  setValue (value) {
    this.inputTarget.value = value
    this.inputTarget.dispatchEvent(new Event('change'))
    this.hide()
  }

  value () {
    return this.inputTarget.value
  }

  numberOfCharacters () {
    return this.value().length
  }

  handleOutsideClick (event) {
    if (!this.isClickedInside(event)) {
      this.hide()
    }
  }

  isClickedInside (event) {
    if (!event) {
      return false
    }
    const inInput = this.inputTarget.contains(event.target)
    const inDropdown = this.dropdownTarget.contains(event.target)

    return (inInput || inDropdown)
  }
}
