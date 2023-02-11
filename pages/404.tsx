import React from 'react';
import { Typography, Box } from '@mui/material';
import { ShopLayout } from '@/components/layouts';

const Custom404 = () => {
    return (
        <>
            <ShopLayout title='Page not found' pageDescription='Seems that we could not found the content you are looking for'>
                <Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row', justifyContent: 'center', display: 'flex' } }} justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
                    <Typography variant='h1' component='h1' fontSize={70} fontWeight={400} >404 |</Typography>
                    <Typography marginLeft={3} fontWeight={400}>Not page found</Typography>
                </Box>
            </ShopLayout>
        </>
    )
}

export default Custom404