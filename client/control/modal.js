import React from 'react'
import Modal from 'react-modal'
import { withState } from 'recompact'

const withModalState = withState('open', 'setOpen', false)

export default withModalState(
	({ control: Control = 'button', open, setOpen, render, ...props }) => (
		<>
			<Control onClick={() => setOpen(true)} />
			<Modal isOpen={open} onRequestClose={() => setOpen(false)} {...props}>
				{render({
					...props,
					close: () => setOpen(false)
				})}
			</Modal>
		</>
	)
)
