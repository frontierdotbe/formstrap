import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static get targets () {
    return ['original', 'operator', 'null']
  }

  connect () {
    this.operatorTarget.addEventListener('change', () => this.handleOperatorChange())
    this.handleOperatorChange()
  }

  handleOperatorChange () {
    if (this.operatorTarget.value === 'is_null' || this.operatorTarget.value === 'is_not_null') {
      this.toggleNullInput()
    } else if (this.operatorTarget.value === 'between' || this.operatorTarget.value === 'not_between') {
      this.toggleSecondaryInput()
    } else {
      this.toggleOriginalInput()
    }
  }

  toggleNullInput () {
    this.hideOriginal()
    this.hideSecondary()
    this.showNull()
  }

  toggleOriginalInput () {
    this.showOriginal()
    this.hideSecondary()
    this.hideNull()
  }

  toggleSecondaryInput () {
    this.showSecondary()
    this.hideOriginal()
    this.hideNull()
  }

  hideOriginal () {
    this.originalTarget.style.display = 'none'
    this.originalTarget.setAttribute('data-filter-target', 'value_original')
  }

  showOriginal () {
    this.originalTarget.style.display = 'block'
    this.originalTarget.setAttribute('data-filter-target', 'value')
  }

  hideSecondary () {
    for (const [index, value] of this.originalTargets.entries()) {
      if (index !== 0) {
        value.style.display = 'none'
        value.setAttribute('data-filter-target', 'value_original')
      }
    }
  }

  showSecondary () {
    for (const [index, value] of this.originalTargets.entries()) {
      if (index !== 0) {
        value.style.display = 'block'
        value.setAttribute('data-filter-target', 'value')
      }
    }
  }

  hideNull () {
    this.nullTarget.style.display = 'none'
    this.nullTarget.setAttribute('data-filter-target', 'value_null')
  }

  showNull () {
    this.nullTarget.style.display = 'block'
    this.nullTarget.setAttribute('data-filter-target', 'value')
  }
}
