import React, { useContext, useEffect } from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router'

const CartPage = () => {

    const router = useRouter()
    const { isLoaded, cart } = useContext(CartContext)

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace(`/cart/empty`)
        }
    }, [cart, isLoaded, router])
    
    if (isLoaded && cart.length === 0) {
        return <></>
    }

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
                                    <Link
                                        href={'/checkout/address'}
                                    >
                                    
                                        <Button
                                            color='secondary'
                                            className='circular-btn'
                                            fullWidth
                                        >Checkout</Button>
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