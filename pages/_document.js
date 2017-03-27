import Document, { Head, Main, NextScript } from 'next/document';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import {injectGlobal} from 'styled-components'

injectGlobal`
body {
	font-family: Bookmania;
	line-height: 1.6;
	font-size: 24px;
	margin: 0;
}
`;


export default class MyDocument extends Document {
	static async getInitialProps ({ renderPage }) {
		const page = renderPage();
		const style = styleSheet.rules().map(rule => rule.cssText).join('\n');
		return { ...page, style }
	}

	render () {
		return (
			<html>
				<Head>
					<title>My page</title>
					<style dangerouslySetInnerHTML={{ __html: this.props.style }} />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		)
	}
}
