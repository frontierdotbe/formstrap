export default class {
  static get locale () {
    if (window.I18n === undefined) {
      const locale = document.querySelector('html').getAttribute('lang')
      window.I18n = {
        locale: locale || 'en'
      }
    }
    return window.I18n.locale
  }
}
