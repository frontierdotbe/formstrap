/* global FileReader, DataTransfer */
import { Controller } from '@hotwired/stimulus'

// References:
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

export default class extends Controller {
  static get targets () {
    return ['thumbnails', 'template', 'input', 'placeholder', 'thumbnail', 'thumbnailDestroy']
  }

  connect () {
    this.thumbnailWidth = this.firstThumbnailWidth()
    this.thumbnailHeight = this.firstThumbnailHeight()
  }

  preview () {
    this.removeThumbnails()
    this.addThumbnails()
    this.togglePlaceholder()
  }

  togglePlaceholder () {
    if (this.hasFilesSelected()) {
      this.hidePlaceholder()
    } else {
      this.showPlaceholder()
    }
  }

  hasFilesSelected () {
    return this.hasInputFiles() || this.hasVisibleAttachments()
  }

  hasVisibleAttachments () {
    return this.visibleAttachments().length > 0
  }

  hasAttachments () {
    return this.attachments().length > 0
  }

  hasInputFiles () {
    return this.inputFiles().length > 0
  }

  attachments () {
    return this.thumbnailTargets.filter((thumbnail) => {
      return this.isAttachment(thumbnail)
    })
  }

  visibleAttachments () {
    return this.attachments().filter((thumbnail) => {
      return !thumbnail.classList.contains('d-none')
    })
  }

  inputFiles () {
    return Array.from(this.inputTarget.files)
  }

  writeInputFiles (files) {
    const dataTransfer = new DataTransfer()
    files.forEach((file) => {
      dataTransfer.items.add(file)
    })
    this.inputTarget.files = dataTransfer.files
  }

  remove (event) {
    const thumbnail = event.target.closest('[data-file-preview-target="thumbnail"]')
    this.removeThumbnail(thumbnail, event.params.name)
    this.togglePlaceholder()
  }

  isAttachment (thumbnail) {
    return thumbnail.querySelector('[data-file-preview-target="thumbnailDestroy"]')
  }

  removeInputFile (thumbnail, fileName) {
    let files = this.inputFiles()
    files = files.filter((file) => {
      return file.name !== fileName
    })
    thumbnail.remove()
    this.writeInputFiles(files)
  }

  removeAttachment (thumbnail) {
    const destroyInput = thumbnail.querySelector('[data-file-preview-target="thumbnailDestroy"]')
    destroyInput.value = '1'
    thumbnail.classList.add('d-none')
  }

  showPlaceholder () {
    this.placeholderTarget.classList.remove('d-none')
  }

  hidePlaceholder () {
    this.placeholderTarget.classList.add('d-none')
  }

  removeThumbnails () {
    this.thumbnailTargets.forEach((thumbnail) => {
      this.removeThumbnail(thumbnail)
    })
  }

  removeThumbnail (thumbnail, filename) {
    if (this.isAttachment(thumbnail)) {
      this.removeAttachment(thumbnail)
    } else {
      this.removeInputFile(thumbnail, filename)
    }
  }

  addThumbnails () {
    const files = this.inputFiles()
    files.forEach((file) => {
      const thumbnail = this.generateDummyThumbnail()
      this.appendThumbnail(thumbnail)
      this.updateThumbnail(this.lastThumbnail(), file)
    })
  }

  generateDummyThumbnail () {
    return this.templateTarget.content.cloneNode(true)
  }

  appendThumbnail (thumbnail) {
    return this.thumbnailsTarget.appendChild(thumbnail)
  }

  updateThumbnail (thumbnail, file) {
    this.updateThumbnailRemoveButton(thumbnail, file.name)

    const title = this.titleForFile(file)
    this.updateThumbnailTitle(thumbnail, title)

    const icon = this.iconForMimeType(file.type)
    this.updateThumbnailIcon(thumbnail, icon)

    if (this.isImage(file)) {
      this.updateThumbnailImage(thumbnail, file)
    }
  }

  updateThumbnailImage (thumbnail, file) {
    this.fileToBase64(file).then(base64 => {
      this.updateThumbnailBackground(thumbnail, base64)
      this.removeThumbnailIcon(thumbnail)
    })
  }

  titleForFile (file) {
    const byteSizeString = this.bytesToString(file.size)
    return `${file.name} (${byteSizeString})`
  }

  bytesToString (bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }

  updateThumbnailRemoveButton (thumbnail, fileName) {
    const removeButton = thumbnail.querySelector('.h-form-file-thumbnail-remove')
    if (removeButton) {
      removeButton.dataset.filePreviewNameParam = fileName
    }
  }

  updateThumbnailTitle (thumbnail, title) {
    thumbnail.title = title
  }

  updateThumbnailBackground (thumbnail, url) {
    const thumbnailBackground = thumbnail.querySelector('.h-thumbnail-bg')
    thumbnailBackground.style.backgroundImage = `url('${url}')`
  }

  removeThumbnailIcon (thumbnail) {
    thumbnail.querySelector('.h-thumbnail-bg').innerHTML = ''
  }

  updateThumbnailIcon (thumbnail, icon) {
    thumbnail.querySelector('.h-thumbnail-bg').innerHTML = icon
  }

  iconForMimeType (mimeType) {
    const typeMap = {
      image: ['image/bmp', 'image/gif', 'image/vnd.microsoft.icon', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp'],
      play: ['video/mp4', 'video/mpeg', 'video/ogg', 'video/mp2t', 'video/webm', 'video/3gpp', 'video/3gpp2'],
      music: ['audio/aac', 'audio/midi', 'audio/x-midi', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'audio/wav', 'audio/webm', 'audio/3gpp', 'audio/3gpp2'],
      word: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      ppt: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      slides: ['application/vnd.oasis.opendocument.presentation'],
      spreadsheet: ['application/vnd.oasis.opendocument.spreadsheet'],
      richtext: ['application/vnd.oasis.opendocument.text'],
      zip: ['application/zip application/x-7z-compressed', 'application/x-bzip application/x-bzip2 application/gzip application/vnd.rar'],
      pdf: ['application/pdf']
    }

    const iconName = Object.keys(typeMap).find(key => typeMap[key].includes(mimeType))
    const fullIconName = ['bi', 'file', 'earmark', iconName].filter(e => typeof e === 'string' && e !== '').join('-')

    return `<i class="bi ${fullIconName} h-thumbnail-icon"></i>`
  }

  isImage (file) {
    return file.type.match(/^image/) !== null
  }

  fileToBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  thumbnails () {
    return this.thumbnailsTarget.querySelectorAll('.img-thumbnail')
  }

  firstThumbnail () {
    return this.thumbnailsTarget.firstElementChild
  }

  lastThumbnail () {
    return this.thumbnailsTarget.lastElementChild
  }

  firstThumbnailWidth () {
    return this.firstThumbnail().style.width
  }

  firstThumbnailHeight () {
    return this.firstThumbnail().style.height
  }
}
