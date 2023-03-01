import React from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrder } from '@/database'
import { IOrder } from '../../interfaces/order';

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

    console.log(order, 'orden del usuari')
    const { shippingAddress } = order
        return (
        
        <>
            <ShopLayout
                title={`Order - ${order._id}`}
                pageDescription='Sumary of your order'
            >
                    <Typography variant='h1' component='h1'>Order - {order._id}s</Typography>
                    {
                        order.isPaid
                            ? (
                                <Chip
                                sx={{ my: 2 }}
                                label='Order Paid'
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined />}
                            />
                            ) :
                            (
                                <Chip
                                    sx={{ my: 2 }}
                                    label='Pending of payment'
                                    variant='outlined'
                                    color='error'
                                    icon={<CreditCardOffOutlined />}
                                />
                            )
                    }
                    
                <Grid container spacing={2} marginTop={3}>
                    <Grid item xs={12} sm={7}>
                        { /** Listado de items en el carrito */}
                        <CartList editable={false} products={order.orderItems} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                    <Typography variant='h2'>Your Order summary ({order.numberOfItems} Item{order.numberOfItems > 1 ? 's' : ''})</Typography>
                                <Divider sx={{ my: 1 }} />
                                    {/*<Box
                                        display='flex'
                                        justifyContent='end'
                                    >
                                        <Link
                                            href={'/checkout/address'}
                                            style={{ textDecoration: 'none'}}
                                        >
                                            <Typography>Edit</Typography>
                                        </Link>        
                                    </Box>*/}
                                    <Typography variant='subtitle1'>address of delivery</Typography>
                                    <Typography>{shippingAddress.firstName} { shippingAddress.lastName}</Typography>
                                    <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : '' }</Typography>
                                    <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                                    <Typography>{shippingAddress.country}</Typography>
                                    <Typography>{shippingAddress.phone}</Typography>
                                    
                                    <Divider sx={{ my: 1 }} />
                                {/**Order Summary */}
                                <CartSummary orderValues={{numberOfItems: order.numberOfItems, subtotal: order.subTotal, total: order.total, tax: order.tax }} />
                                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                                        
                                        {
                                            order.isPaid
                                                ? (
                                                    <Chip
                                                        sx={{ my: 2 }}
                                                        label='Order Paid'
                                                        variant='outlined'
                                                        color='success'
                                                        icon={<CreditScoreOutlined />}
                                                    />
                                                ) : (
                                                    <h1>Make payment</h1>
                                                )
                                        }
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {

    const { id = '' } = query

    const session: any = await getSession({ req })
    
    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrder.getOrderById(id.toString())

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}


export default OrderPage