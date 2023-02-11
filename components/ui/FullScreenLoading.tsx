import { Box, CircularProgress, Typography } from '@mui/material'
import React, { FC } from 'react'


export const FullScreenLoading:FC = () => {

    return (
        <>
            <Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row', justifyContent: 'center', display: 'flex' } }} justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
                <CircularProgress color='inherit' size={80} thickness={3} />
                <Typography variant='h5' mt={5} fontWeight='bold'>Loading</Typography>
            </Box>
        </>
    )
}