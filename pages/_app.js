import '../styles/globals.css';
import Layout from "../componants/Layout";

function MyApp({ Component, pageProps }) {
  return <div>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </div>
}

export default MyApp
