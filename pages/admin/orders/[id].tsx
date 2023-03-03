import React from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined, ShopTwoOutlined } from '@mui/icons-material'
import { GetServerSideProps, NextPage } from 'next'
import { dbOrder } from '@/database'
import { IOrder } from '../../../interfaces/order';
import { AdminLayout } from '../../../components/layouts/AdminLayout';

interface Props {
    order: IOrder
}


const OrderPage: NextPage<Props> = ({order}) => {

    const { shippingAddress } = order
    
        return (
        
        <>
            <AdminLayout
                title={`Order - ${order._id}`}
                    subtitle='Sumary of the order'
                    icon={ <ShopTwoOutlined /> }
            >
                    {/*<Typography variant='h1' component='h1'>Order - {order._id}</Typography>*/}
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
                                    <Box display='flex' sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                                    
                                        <Box
                                            sx={{ flexDirection: 'column', display: 'flex' }}
                                        >
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
                                                        <Chip
                                                            sx={{ my: 2 }}
                                                            label='Pending of payment'
                                                            variant='outlined'
                                                            color='error'
                                                            icon={<CreditCardOffOutlined />}
                                                        />
                                                    )
                                            }
                                        </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </AdminLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {

    const { id = '' } = query


    const order = await dbOrder.getOrderById(id.toString())

    if (!order) {
        return {
            redirect: {
                destination: `/admin/orders`,
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