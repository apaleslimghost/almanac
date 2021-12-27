import { Controller } from 'stimulus'
import EditorJS from '@editorjs/editorjs'
import Rails from '@rails/ujs'

// Connects to data-controller="editor"
export default class extends Controller {
  static values = { action: String }
  static targets = ['content', 'rendered']

  connect() {
    if(this.renderedTarget) {
      this.renderedTarget.remove()
    }

    const content = JSON.parse(this.contentTarget.innerText)

    this.editor = new EditorJS({
      holder: this.element,
      data: content,
      onReady: () => {
        this.editor.caret.setToLastBlock('end')
      },
      onChange: () => {
        this.saveContent()
      },
      autofocus: true,
      placeholder: ''
    })
  }

  async saveContent() {
    const content = await this.editor.save()

    const response = await fetch(this.actionValue, {
      method: 'PATCH',
      body: JSON.stringify({ card: { content } }),
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-csrf-token': Rails.csrfToken()
      }
    })

    console.log(await response.json())
  }
}
