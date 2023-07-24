import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Dashboard from "@/components/Dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Kokoustin²</title>
        <meta name="description" content="Toisen sukupolven pöytäkirja-applikaatio." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Dashboard>
        <h1></h1>
      </Dashboard>
    </>
  );
}
