import { Grid, Typography } from '@mui/material';
import React from 'react'

export const CartSummary = () => {

    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Typography>No. Products</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>3</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{`256.30`}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Taxes</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>25.50</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>Total</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>278.30</Typography>
                </Grid>
            </Grid>
        </>
    )
}