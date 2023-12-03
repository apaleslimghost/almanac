module EditorJsHelper
	def render_blocks(data)
		return '' unless data
		RenderEditorjs.render(data).html_safe
	end
end
