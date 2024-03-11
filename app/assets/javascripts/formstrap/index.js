/* global Stimulus */
import { Application } from '@hotwired/stimulus'
import AutocompleteController from './controllers/autocomplete_controller'
import DateRangeController from './controllers/date_range_controller'
import DropzoneController from './controllers/dropzone_controller'
import FilePreviewController from './controllers/file_preview_controller'
import FlatpickrController from './controllers/flatpickr_controller'
import InfiniteScrollerController from './controllers/infinite_scroller_controller'
import MediaController from './controllers/media_controller'
import MediaModalController from './controllers/media_modal_controller'
import NestedPreviewController from './controllers/nested_preview_controller'
import PopupController from './controllers/popup_controller'
import PreviewController from './controllers/preview_controller'
import RedactorxController from './controllers/redactorx_controller'
import RepeaterController from './controllers/repeater_controller'
import SelectController from './controllers/select_controller'
import TextareaController from './controllers/textarea_controller'

export class Formstrap {
  static start () {
    window.Stimulus = window.Stimulus || Application.start()
    Stimulus.register('autocomplete', AutocompleteController)
    Stimulus.register('date-range', DateRangeController)
    Stimulus.register('dropzone', DropzoneController)
    Stimulus.register('file-preview', FilePreviewController)
    Stimulus.register('flatpickr', FlatpickrController)
    Stimulus.register('infinite-scroller', InfiniteScrollerController)
    Stimulus.register('media', MediaController)
    Stimulus.register('media-modal', MediaModalController)
    Stimulus.register('nested-preview', NestedPreviewController)
    Stimulus.register('popup', PopupController)
    Stimulus.register('preview', PreviewController)
    Stimulus.register('redactorx', RedactorxController)
    Stimulus.register('repeater', RepeaterController)
    Stimulus.register('select', SelectController)
    Stimulus.register('textarea', TextareaController)
  }
}
