/* global Stimulus */
import { Application } from '@hotwired/stimulus'
import AutocompleteController from './controllers/autocomplete_controller'
import BlocksController from './controllers/blocks_controller'
import DateRangeController from './controllers/date_range_controller'
import DropzoneController from './controllers/dropzone_controller'
import FilePreviewController from './controllers/file_preview_controller'
import FilterController from './controllers/filter_controller'
import FilterRowController from './controllers/filter_row_controller'
import FiltersController from './controllers/filters_controller'
import FlatpickrController from './controllers/flatpickr_controller'
import HelloController from './controllers/hello_controller'
import InfiniteScrollerController from './controllers/infinite_scroller_controller'
import MediaController from './controllers/media_controller'
import MediaModalController from './controllers/media_modal_controller'
import NotificationController from './controllers/notification_controller'
import PopupController from './controllers/popup_controller'
import RedactorxController from './controllers/redactorx_controller'
import RemoteModalController from './controllers/remote_modal_controller'
import RepeaterController from './controllers/repeater_controller'
import SelectController from './controllers/select_controller'
import TableActionsController from './controllers/table_actions_controller'
import TableController from './controllers/table_controller'
import TextareaController from './controllers/textarea_controller'

export class Formstrap {
  static start () {
    window.Stimulus = window.Stimulus || Application.start()
    Stimulus.register('autocomplete', AutocompleteController)
    Stimulus.register('blocks', BlocksController)
    Stimulus.register('date-range', DateRangeController)
    Stimulus.register('dropzone', DropzoneController)
    Stimulus.register('file-preview', FilePreviewController)
    Stimulus.register('filter', FilterController)
    Stimulus.register('filter-row', FilterRowController)
    Stimulus.register('filters', FiltersController)
    Stimulus.register('flatpickr', FlatpickrController)
    Stimulus.register('hello', HelloController)
    Stimulus.register('infinite-scroller', InfiniteScrollerController)
    Stimulus.register('media', MediaController)
    Stimulus.register('media-modal', MediaModalController)
    Stimulus.register('notification', NotificationController)
    Stimulus.register('popup', PopupController)
    Stimulus.register('redactorx', RedactorxController)
    Stimulus.register('remote-modal', RemoteModalController)
    Stimulus.register('repeater', RepeaterController)
    Stimulus.register('select', SelectController)
    Stimulus.register('table', TableController)
    Stimulus.register('table-actions', TableActionsController)
    Stimulus.register('textarea', TextareaController)
  }
}
