import { Controller } from 'stimulus'
import debounce from 'lodash.debounce'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Drop from '../lib/drop'

import api from '../lib/api'

// Connects to data-controller="editor"
export default class extends Controller {
  static values = { action: String, search: String }
  static targets = ['content', 'rendered', 'editor']

  connect() {
    this.saveContent = debounce(this.saveContent.bind(this), 500)
    const content = JSON.parse(this.contentTarget.innerText)

    this.editor = new Editor({
      element: this.editorTarget,
      content,
      onCreate: () => {
        if(this.renderedTarget) {
          this.renderedTarget.remove()
        }
      },
      onUpdate: () => {
        this.saveContent()
      },
      autofocus: 'end',
      extensions: [
        StarterKit,
        Drop
      ]
    })
  }

  async saveContent() {
    const content = this.editor.getJSON()
    const results = await api(this.actionValue, { card: { content } }, {method: 'PATCH'})

    console.log(results)
  }
}
