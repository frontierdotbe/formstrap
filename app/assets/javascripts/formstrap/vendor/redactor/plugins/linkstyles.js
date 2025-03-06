/* global Redactor */
Redactor.add('plugin', 'linkstyles', {
  translations: {
    en: {
      linkstyles: {
        label: 'Styles',
        link: 'Link',
        primary: 'Primary',
        secondary: 'Secondary'
      }
    }
  },
  defaults: {
    items: [
      { name: 'link', value: '' },
      { name: 'primary', value: 'button button-primary' },
      { name: 'secondary', value: 'button button-secondary' }
    ]
  },
  subscribe: {
    'modal.before.open': function () {
      const name = this.app.modal.getName()
      if (name === 'link') {
        this.setDefaultValue()
      }
    },
    'modal.open': function () {
      const name = this.app.modal.getName()
      if (name === 'link') {
        this.prepareModal()
      }
    },
    'link.change': function (e) {
      let link = e.data.element.nodes[0]
      link = this.ensureValidProtocol(link)
      this.applyStylingToLink(link)
    },
    'link.add': function (e) {
      let link = e.data.element.nodes[0]
      link = this.ensureValidProtocol(link)
      this.applyStylingToLink(link)
    }
  },
  init () {
    this.selectedValue = ''
  },
  // private
  prepareModal () {
    const stack = this.app.modal.getStack()

    const item = stack.getFormItem('url')

    const box = this.dom('<div>').addClass('rx-form-item')

    // Add a select
    box.append(this.buildLabel())
    box.append(this.buildSelect())

    // Add select to the modal
    item.after(box)
  },
  applyStylingToLink (link) {
    // Clear all classes
    link.classList.remove(...link.classList)

    // Get styling
    const classNames = this.selectedValue.split(' ')

    // Apply classes if any
    classNames.forEach((className) => {
      if (className.length === 0) return
      link.classList.add(className)
    })
  },
  ensureValidProtocol (link) {
    let url = link.getAttribute('href')

    // Match valid protocols
    const regex = /^(https?:\/\/|mailto:|ftp:\/\/)/i
    if (!regex.test(url)) {
      url = `https://${url}`
    }

    link.setAttribute('href', url)
    return link
  },
  buildSelect () {
    // Create a select node
    const select = this.dom('<select>').addClass('rx-form-select')

    // Populate the select with options
    const items = this.opts.get('linkstyles.items')
    items.forEach((data, index) => {
      // Create an option node
      const option = this.dom('<option>')

      // Set value and text
      option.val(data.value)
      option.html(this.lang.get('linkstyles.' + data.name))

      // Append option to select
      select.append(option)
    })

    // Set the value of the select
    select.val(this.selectedValue)

    // Listen to select changes
    select.on('change', (e) => {
      this.selectedValue = e.target.value
    })

    return select
  },
  buildLabel () {
    const label = this.dom('<label>').addClass('rx-form-label')
    label.html(this.lang.get('linkstyles.label'))

    return label
  },
  setDefaultValue () {
    this.selectedValue = this.getLink().attr('class') || ''
  },
  getLink () {
    const links = this.getLinks()

    return (links.length !== 0) ? links.eq(0) : this.dom()
  },
  getLinks () {
    const selection = this.app.create('selection')
    if (!selection.is()) {
      return this.dom()
    }

    const links = selection.getNodes({ tags: ['a'] })

    return (links.length !== 0) ? this.dom(links) : this.dom()
  }
})
