import { Turbo } from '@hotwired/turbo-rails'
import Rails from '@rails/ujs'

export default async (path, data, extraOptions) => {
	const options = {
		method: 'POST',
		headers: {
			'accept': 'application/json',
			'x-csrf-token': Rails.csrfToken()
		},
		...extraOptions
	}

	if(options.method !== 'GET') {
		if(data instanceof FormData) {
			options.body = data
		} else {
			options.body = JSON.stringify(data)
			options.headers['content-type'] = 'application/json'
		}
	}

	const response = await fetch(path, options)

	if(response.redirected) {
      Turbo.visit(response.url, { action: 'replace' })
	}

	if(response.headers.get('content-type') === 'application/json') {
		return response.json()
	} else {
		return response.text()
	}
}
