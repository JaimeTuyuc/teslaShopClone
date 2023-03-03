import React, { FC, useContext } from 'react'
import { AppBar, Box, Button, Toolbar, Typography,  } from '@mui/material'
import NextLink from 'next/link'
import { UiContext } from '@/context'

interface Props {

}

export const AdminNavBar: FC<Props> = () => {
    const { isMenuOpen, handleSidebar } = useContext(UiContext)


    const handleSideBarToggle = () => {
        handleSidebar(!isMenuOpen)
    }

    return (
        <>
            <AppBar >
                <Toolbar>
                    <NextLink
                        href={'/'}
                        style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Typography variant='h6'>Tesla |</Typography>
                        <Typography marginLeft={0.5}>Shop</Typography>
                    </NextLink>
                    <Box flex={1} />

                    <Button
                        onClick={handleSideBarToggle}
                    >Menu</Button>
                </Toolbar>
            </AppBar>
        </>
    )
}