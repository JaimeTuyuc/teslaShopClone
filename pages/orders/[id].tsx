import React from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'

const OrderPage = () => {

        return (
        
        <>
            <ShopLayout
                title='Order page - 15246adsf'
                pageDescription='Sumary of your order'
            >
                    <Typography variant='h1' component='h1'>Order - 5sadf6adf16as</Typography>
                    
                    {/*<Chip
                        sx={{ my: 2 }}
                        label='Pending of payment'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    />*/}

                    <Chip
                        sx={{ my: 2 }}
                        label='Order Paid'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />
                    
                <Grid container spacing={2} marginTop={3}>
                    <Grid item xs={12} sm={7}>
                        { /** Listado de items en el carrito */}
                        <CartList editable={false} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant='h2'>Your Order summary (3 Items)</Typography>
                                <Divider sx={{ my: 1 }} />
                                    <Box
                                        display='flex'
                                        justifyContent='end'
                                    >
                                        <Link
                                            href={'/checkout/address'}
                                            style={{ textDecoration: 'none'}}
                                        >
                                            <Typography>Edit</Typography>
                                        </Link>        
                                    </Box>
                                    <Typography variant='subtitle1'>Edit address of delivery</Typography>
                                    <Typography>James Tuyuc</Typography>
                                    <Typography>25 some place</Typography>
                                    <Typography>Roosevelt st, GT 12458</Typography>
                                    <Typography>+502 54845784</Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Box
                                        display='flex'
                                        justifyContent='end'
                                    >
                                        <Link
                                            href={'/cart'}
                                            style={{ textDecoration: 'none'}}
                                        >
                                            <Typography>Edit Items</Typography>
                                        </Link>        
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                {/**Order Summary */}
                                <CartSummary />
                                <Box sx={{ mt: 3 }}>
                                    <h1>Make payment</h1>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}


export default OrderPage