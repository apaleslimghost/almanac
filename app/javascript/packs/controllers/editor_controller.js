import { Controller } from '@hotwired/stimulus'
import debounce from 'lodash.debounce'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import api from '../lib/api'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Placeholder from '@tiptap/extension-placeholder'
import FloatingMenu from '@tiptap/extension-floating-menu'

// Connects to data-controller="editor"
export default class extends Controller {
  static values = { action: String, search: String }
  static targets = ['content', 'rendered', 'editor', 'bubbleMenu', 'floatingMenu']

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
        Placeholder,
        BubbleMenu.configure({
          element: this.bubbleMenuTarget
        }),
        FloatingMenu.configure({
          element: this.floatingMenuTarget
        })
      ]
    })
  }

  async saveContent() {
    const content = this.editor.getJSON()
    const results = await api(this.actionValue, { card: { content } }, {method: 'PATCH'})

    console.log(results)
  }

  format(event) {
    const { format, args } = event.params

    this.editor.chain()[format](args).focus().run()
  }
}
