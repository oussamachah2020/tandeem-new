import "./styles/globals.css";
import type {AppProps} from "next/app";
import {Poppins} from "next/font/google";
import Head from "next/head";
import {useState} from "react";
import NotificationsContext from "@/common/context/NotificationsContext";
import Notification from "@/common/components/global/Notification";
import staticValues from "@/common/context/StaticValues";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: "--font-primary"
})

const App = ({Component, pageProps}: AppProps) => {
    const notificationKeyState = useState<keyof typeof staticValues.notification | null>(null)
    return (
        <>
            <Head>
                <title>tandeem</title>
                <meta
                    name='description'
                    content='La plateforme qui vous permet de personnaliser les avantages de vos collaborateurs.'
                />
                <meta name='viewport'
                      content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'/>
                <link rel="icon" href="/img/logo-white-1.svg" media="(prefers-color-scheme: dark)"/>
                <link rel="icon" href="/img/logo-blue-1.svg" media="(prefers-color-scheme: light)"/>
            </Head>
            <NotificationsContext.Provider value={notificationKeyState}>
                <div className={`${poppins.variable} font-primary`}>
                    <Component {...pageProps} />
                </div>
                <Notification/>
            </NotificationsContext.Provider>
        </>
    );
}

export default App
