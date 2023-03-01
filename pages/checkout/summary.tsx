import React, { useContext, useEffect, useState } from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { CartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils/countries';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router'

const SummaryPage = () => {
    
    const { shippingAddress, cart, numberOfItems, createOrder } = useContext(CartContext)
    const router = useRouter()
    const [ isPosting, setIsPosting ] = useState<boolean>(false)
    const [ errorMessage, setErrorMessage] = useState<string>('')
    useEffect(() => {
        if (!Cookie.get('firstName')) {
            router.push('/checkout/address ')
        }
    }, [router])
    
    const onCreateOrder = async () => {
        setIsPosting(true)
        const { hasError, message } = await createOrder()

        if (hasError) {
            setIsPosting(false)
            setErrorMessage(message)
            return;
        }

        router.replace(`/orders/${message}`)
    }

    if (!shippingAddress) {
        return <></>
    }
    const { firstName, lastName, address, address2 = '', phone, zip, city, country } = shippingAddress
        return (
        
        <>
            <ShopLayout
                title='Summary Page'
                pageDescription='Items added on you cart'
            >
                <Typography variant='h1' component='h1'>Summary Page</Typography>

                <Grid container spacing={2} marginTop={3}>
                    <Grid item xs={12} sm={7}>
                        { /** Listado de items en el carrito */}
                        <CartList editable={false} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                    <Typography variant='h2'>Your Order summary {numberOfItems} {cart.length > 1 ? 'Items' : 'Item'}</Typography>
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
                                    <Typography>{firstName} {lastName}</Typography>
                                    <Typography>{address} { address2 ? `, ${address2}`: ''}</Typography>
                                    <Typography>{city}, {zip}</Typography>
                                    <Typography>{ countries.find((c) => c.code === country)?.name }</Typography>
                                    <Typography>{phone}</Typography>
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
                                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                                    
                                        <Button 
                                            onClick={onCreateOrder}
                                            color='secondary' 
                                            className='circular-btn' 
                                            fullWidth
                                            disabled={isPosting}
                                        >Confirm Order</Button>

                                        <Chip
                                            color='error'
                                            label={errorMessage}
                                            sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                                        />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}


export default SummaryPage