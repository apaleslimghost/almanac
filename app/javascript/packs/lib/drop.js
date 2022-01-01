import { NodeSelection, Plugin } from "prosemirror-state"
import { serializeForClipboard } from "prosemirror-view/src/clipboard"
import { Extension } from "@tiptap/core"
import React from "jsx-dom"

function createRect(rect) {
	if (rect == null) {
	  return null
	}

	let newRect = {
	  left: rect.left + document.body.scrollLeft,
	  top: rect.top + document.body.scrollTop,
	  width: rect.width,
	  height: rect.height,
	  bottom: 0,
	  right: 0,
	}

	newRect.bottom = newRect.top + newRect.height
	newRect.right = newRect.left + newRect.width

	return newRect
 }

function absoluteRect(element) {
	return createRect(element.getBoundingClientRect())
}

const closest = (node, selector) => node.nodeType === 3
	? node.parentNode.closest(selector)
	: node.closest(selector)

function nodeAtCoords(view, coords) {
	if(!view.posAtCoords) console.log(view)
	const { pos, inside } = view.posAtCoords(coords)
	return view.nodeDOM(inside === -1 ? pos : inside)
}

function blockPosAtCoords(coords, view) {
  const node = nodeAtCoords(view, coords)

  if (node && node.nodeType === 1) {
    const desc = view.docView.nearestDesc(node, true)
    if (desc && (desc !== view.docView)) {
      return desc.posBefore
    }
  }

  return null
}

function dragStart(e, view) {
  if (!e.dataTransfer) return

  const coords = { left: e.clientX + 50, top: e.clientY }
  const pos = blockPosAtCoords(coords, view)
  console.log(pos)

  if (pos != null) {
    view.dispatch(
      view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
    )

    const slice = view.state.selection.content()
    const { dom, text } = serializeForClipboard(view, slice)

    e.dataTransfer.clearData()
    e.dataTransfer.setData("text/html", dom.innerHTML)
    e.dataTransfer.setData("text/plain", text)

    view.dragging = { slice, move: true }
  }
}

const WIDTH = 24

export default Extension.create({
  name: "drop",
  addProseMirrorPlugins() {
    let dropElement

    return [
      new Plugin({
        view(editorView) {
          dropElement = (
            <div
              draggable="true"
              className="note-drag-handle"
              onDragStart={(e) => dragStart(e, editorView)}
            >
              ⠿
            </div>
          )
          document.body.appendChild(dropElement)


          return {
            update(view, prevState) {},
            destroy() {
              dropElement.remove()
              dropElement = null
            },
          }
        },

        props: {
          handleDOMEvents: {
            drop(view, event) {
              setTimeout(() => {
                const node = document.querySelector(
                  ".ProseMirror-hideselection"
                )
                if (node) {
                  node.classList.remove("ProseMirror-hideselection")
                }
              }, 50)
            },

            mousemove(view, event) {
              const coords = {
                left: event.clientX + WIDTH + 10,
                top: event.clientY,
              }
				  const node = nodeAtCoords(view, coords)

					if(!node) return

              const rect = absoluteRect(node)

              rect.top += window.pageYOffset
              rect.left += window.pageXOffset
              rect.width = WIDTH + "px"

              dropElement.style.left = -WIDTH + rect.left + "px"
              dropElement.style.top = rect.top + "px"
            },
          },
        },
      }),
    ]
  },
})
