import React, { FC, useContext } from 'react'
import { Grid, Typography } from '@mui/material'
import { CartContext } from '../../context/cart/CartContext';
import { currency } from '@/utils';


interface Props {
    orderValues?: {
        numberOfItems: number
        subtotal: number
        total: number
        tax: number

    }
}

export const CartSummary:FC<Props> = ({ orderValues }) => {

    const { numberOfItems, subtotal, total, tax } = useContext(CartContext)
    const summaryValues = orderValues ? orderValues : { numberOfItems, subtotal, total, tax }
    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <Typography>No. Products</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{summaryValues.numberOfItems} Item{summaryValues.numberOfItems > 1 ? 's' : ''}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{ currency.format(summaryValues.subtotal) }</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}  %)</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end'>
                    <Typography>{currency.format(summaryValues.tax)}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>Total</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>{currency.format(summaryValues.total)}</Typography>
                </Grid>
            </Grid>
        </>
    )
}