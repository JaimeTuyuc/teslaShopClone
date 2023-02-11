import React, { FC, ReactNode } from 'react'
import Head from 'next/head'
import { NavBar, SideMenu } from '../ui'

interface Props {
    title: string
    pageDescription: string
    imageFullUrl?: string
    children: ReactNode
}

export const ShopLayout:FC<Props> = ({children, title = 'Tesla - Shop center', pageDescription, imageFullUrl}) => {

    return (
        <>
            <Head>
                <title>{title}</title>
                
                <meta name='description' content={pageDescription} />
                <meta name='og:title' content={title} />
                <meta name='og:description' content={pageDescription} />

                {
                    imageFullUrl && (
                        <meta name='og:description' content={imageFullUrl} />
                    )
                }
            </Head>

            <nav>

                { /*  TODO nav bar here */}
                <NavBar />
            </nav>

            { /** Side Bar Here */}
            <SideMenu />

            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px'
                }}
            >{children}</main>

            <footer>
                { /* TODO custom footer here */}
            </footer>
        </>
    )
}