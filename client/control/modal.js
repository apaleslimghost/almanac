import React, { useState } from 'react'
import Modal from 'react-modal'

export default ({ control: Control = 'button', render, ...props }) => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Control onClick={() => setOpen(true)} />
			<Modal isOpen={open} onRequestClose={() => setOpen(false)} {...props}>
				{render({
					...props,
					close: () => setOpen(false),
				})}
			</Modal>
		</>
	)
}
