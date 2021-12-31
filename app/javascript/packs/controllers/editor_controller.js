import { Controller } from 'stimulus'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import '@editorjs/link-autocomplete' // wtf
import Marker from '@editorjs/marker'
import NestedList from '@editorjs/nested-list'
import Quote from '@editorjs/quote'
import Underline from '@editorjs/underline'
import Paragraph from '@editorjs/paragraph'

import api from '../lib/api'

// Connects to data-controller="editor"
export default class extends Controller {
  static values = { action: String, search: String }
  static targets = ['content', 'rendered']

  connect() {
    const content = JSON.parse(this.contentTarget.innerText)

    this.editor = new EditorJS({
      holder: this.element,
      data: content,
      onReady: () => {
        if(this.renderedTarget) {
          this.renderedTarget.remove()
        }

        this.editor.caret.setToLastBlock('end')
      },
      onChange: () => {
        this.saveContent()
      },
      autofocus: true,
      placeholder: '',
      tools: {
        header: Header,
        list: NestedList,
        quote: Quote,
        marker: Marker,
        underline: Underline,
        link: {
          class: LinkAutocomplete,
          config: {
            endpoint: this.searchValue,
            queryParam: 'q'
          }
        }
      },
      inlineToolbar: true
    })
  }

  async saveContent() {
    const content = await this.editor.save()

    await api(this.actionValue, { card: { content } }, {method: 'PATCH'})
  }
}
