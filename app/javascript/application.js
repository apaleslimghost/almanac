import { Turbo } from '@hotwired/turbo-rails'
import { Application } from "@hotwired/stimulus"
import Rails from '@rails/ujs'

Rails.start()
Turbo.start()

const application = Application.start()

import AutoSizeInputController from './controllers/auto-size-input-controller.js';
import AutosaveController from './controllers/autosave-controller.js';
import DashboardController from './controllers/dashboard-controller.js';
import EditorController from './controllers/editor_controller.js';
import PopupLinkController from './controllers/popup-link-controller.js';
import UnsplashSearchController from './controllers/unsplash-search-controller.js';
import ToastController from './controllers/toast-controller.js';

application.register('auto-size-input', AutoSizeInputController);
application.register('autosave', AutosaveController);
application.register('dashboard', DashboardController);
application.register('editor', EditorController);
application.register('popup-link', PopupLinkController);
application.register('unsplash-search', UnsplashSearchController);
application.register('toast', ToastController);
import "@hotwired/turbo-rails"

Turbo.StreamActions.redirect = function () {
	const method = this.getAttribute("method")
	Turbo.visit(this.target, { action: method });
};

document.addEventListener('turbo:submit-end', (event) => {
	event.target.closest('dialog')?.requestClose()
})
