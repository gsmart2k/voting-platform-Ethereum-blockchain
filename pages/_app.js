// pages/_app.js
import "../app/globals.css"; // Adjust the path to your global CSS file

export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
