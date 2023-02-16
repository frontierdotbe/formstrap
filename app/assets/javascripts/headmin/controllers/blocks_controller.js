import { Controller } from '@hotwired/stimulus'
import Sortable from 'sortablejs'

export default class extends Controller {
  static get targets () {
    return ['templateBlock', 'block', 'blocks', 'templateEmpty', 'button', 'buttons']
  }

  connect () {
    Sortable.create(this.blocksTarget, {
      onEnd: () => {
        this.reorderPositions()
      }
    })

    this.toggleEmpty()
  }

  toggleEmpty () {
    if (this.blockCount() > 0) {
      const empty = this.blocksTarget.querySelector('#blocks-empty')
      if (empty) {
        empty.remove()
      }
    } else {
      const empty = this.templateEmptyTarget.innerHTML
      this.blocksTarget.insertAdjacentHTML('beforeend', empty)
    }
  }

  add (event) {
    event.preventDefault()
    const blockType = event.target.dataset.type
    let html = this.templateBlockTargets.filter(blockTarget => blockTarget.id === blockType)[0].innerHTML

    html = this.setPosition(html)

    const element = this.blocksTarget.querySelector(`li[data-position='${event.target.dataset.position}']`)

    if (element) {
      element.insertAdjacentHTML('afterend', html)
    } else {
      this.blocksTarget.insertAdjacentHTML('afterbegin', html)
    }

    this.reorderPositions()
    this.toggleEmpty()
  }

  remove (event) {
    event.preventDefault()

    const block = event.target.closest('.list-group-item')
    const destroyInput = block.querySelector("input[name*='_destroy']")

    if (destroyInput) {
      destroyInput.value = 1
      block.style.display = 'none'
    } else {
      block.remove()
    }

    this.reorderPositions()
    this.toggleEmpty()
  }

  setPosition (html) {
    const position = this.retrieveLastPosition() + 1

    return html.replace(/99999/g, position)
  }

  retrieveLastPosition () {
    const blocks = Array.from(this.blockTargets)
    if (blocks.length < 1) {
      return 0
    }

    const lastBlock = blocks.slice(-1)[0]
    return parseInt(lastBlock.querySelector("[name*='position']").value)
  }

  reorderPositions () {
    for (const [index, block] of this.blockTargets.entries()) {
      this.changePositionInfo(block, index)
    }
  }

  changePositionInfo (block, index) {
    block.setAttribute('data-position', index)
    block.querySelector("input[name*='position']").value = index
  }

  blockCount () {
    return this.blockTargets.length
  }
}
