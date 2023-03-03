import React, { FC, ReactNode } from 'react'
import { SideMenu } from '../ui'
import { AdminNavBar } from '../admin';
import { Box, Typography } from '@mui/material';

interface Props {
    title: string
    subtitle: string
    icon?: JSX.Element
    children: ReactNode
}

export const AdminLayout:FC<Props> = ({children, title = 'Tesla - Shop center', subtitle, icon}) => {

    return (
        <>

            <nav>

                { /*  TODO nav bar here */}
                <AdminNavBar />
            </nav>

            { /** Side Bar Here */}
            <SideMenu />

            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px'
                }}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                >
                    <Typography
                        variant='h1'
                        component='h1'
                    >
                        {icon}
                        {' '}
                        {title}
                    </Typography>
                    <Typography
                        variant='h2'
                        sx={{ mb: 2 }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                <Box
                    className='fadeIn'
                >
                    {children}
                </Box>
            </main>

        </>
    )
}