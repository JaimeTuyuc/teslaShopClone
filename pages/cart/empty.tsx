import React from 'react'
import { ShopLayout } from '@/components/layouts'
import { Box, Typography } from '@mui/material'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import Link from 'next/link'

const EmptyPage = () => {

    return (
        <>
            <ShopLayout
                title='Empty page'
                pageDescription='Your cart is empty, start adding some products'
            >
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='calc(100vh - 200px)'
                    sx={{ flexDirection: { xs: 'column', sm: 'row'}}}
                >
                    <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                    
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <Typography>Your cart is empty</Typography>

                        <Link
                            href={'/'}
                            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Typography variant='h4' component='h4' color='secondary'>Go to home</Typography>
                        </Link>
                    </Box>
                </Box>
            </ShopLayout>
        </>
    )
}

export default EmptyPage