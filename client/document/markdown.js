import Markdown from 'react-markdown'
import { withProps } from 'recompact'
import behead from 'remark-behead'

export default withProps({
	plugins: [[behead, { depth: 1 }]]
})(Markdown)