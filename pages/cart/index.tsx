import React from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'

const CartPage = () => {

    return (
        
        <>
            <ShopLayout
                title='Cart page'
                pageDescription='Items added on you cart'
            >
                <Typography variant='h1' component='h1'>Cart</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                        { /** Listado de items en el carrito */}
                        <CartList editable={true} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant='h2'>Your Order</Typography>
                                <Divider sx={{ my: 1 }} />
                                
                                {/**Order Summary */}
                                <CartSummary />
                                <Box sx={{ mt: 3 }}>
                                    <Link href={'/checkout/address'}>
                                    
                                        <Button color='secondary' className='circular-btn' fullWidth>Checkout</Button>
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}

export default CartPage