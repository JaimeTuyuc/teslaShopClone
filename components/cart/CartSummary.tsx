import React, { FC, useContext } from 'react'
import { Grid, Typography } from '@mui/material'
import { CartContext } from '../../context/cart/CartContext';
import { currency } from '@/utils';

export const CartSummary = () => {

    const { numberOfItems, subtotal, total, tax } = useContext(CartContext)

    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Typography>No. Products</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{numberOfItems} Item{numberOfItems < 1 ? 's' : ''}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{ currency.format(subtotal) }</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}  %)</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{currency.format(tax)}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>Total</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>{currency.format(total)}</Typography>
                </Grid>
            </Grid>
        </>
    )
}