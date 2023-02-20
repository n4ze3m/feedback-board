import { type NextPage } from "next";
import Head from "next/head";
import FeatureComponents from "../components/Home/Feature";
import { FooterComponent } from "../components/Home/Footer";
import HeroComponent from "../components/Home/Hero";


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Feedback Board</title>
        <meta name="description" content="An open source feedback board" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main>
        <HeroComponent />
        <FeatureComponents />
        <FooterComponent />
      </main>
    </>
  );
};

export default Home;
