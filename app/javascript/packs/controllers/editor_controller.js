import { Controller } from 'stimulus'
import debounce from 'lodash.debounce'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import api from '../lib/api'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Placeholder from '@tiptap/extension-placeholder'

// Connects to data-controller="editor"
export default class extends Controller {
  static values = { action: String, search: String }
  static targets = ['content', 'rendered', 'editor', 'bubbleMenu']

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
        })
      ]
    })
  }

  async saveContent() {
    const content = this.editor.getJSON()
    const results = await api(this.actionValue, { card: { content } }, {method: 'PATCH'})

    console.log(results)
  }

  bold() {
    this.editor.chain().focus().toggleBold().run()
  }

  italic() {
    this.editor.chain().focus().toggleItalic().run()
  }
}
