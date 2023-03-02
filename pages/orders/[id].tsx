import React, { useState } from 'react'
import { CartList, CartSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrder } from '@/database'
import { IOrder } from '../../interfaces/order';
import { PayPalButtons } from '@paypal/react-paypal-js'
import { tesloApi } from '@/api';
import { useRouter } from 'next/router'

interface Props {
    order: IOrder
}

export interface OrderResponseBody {
    id: string
        status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "COMPLETED"
        | "PAYER_ACTION_REQUIRED";
}

const OrderPage: NextPage<Props> = ({order}) => {

    const { shippingAddress } = order
    const router = useRouter()
    const [ isPaying, setIsPaying ] = useState<boolean>(false)
    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') {
            
            console.log('The order could not be completed')
        }
        setIsPaying(true)
        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            }) 

            router.reload()
        } catch (error) {
            setIsPaying(false)
            console.log(error, 'Inside catch block, unable to procces payment option for order')
        }
    }
    
        return (
        
        <>
            <ShopLayout
                title={`Order - ${order._id}`}
                pageDescription='Sumary of your order'
            >
                    <Typography variant='h1' component='h1'>Order - {order._id}</Typography>
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
                                        <Box sx={{ display: isPaying ? 'flex' : 'none', justifyContent: 'center'}} className='fadeIn'>
                                            <CircularProgress />
                                        </Box>

                                        <Box
                                            sx={{ display: isPaying ? 'none' : 'flex', flex: 1, flexDirection: 'column' }}
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
                                                        <PayPalButtons
                                                            createOrder={(data, actions) => {
                                                                return actions.order.create({
                                                                    purchase_units: [
                                                                        {
                                                                            amount: {
                                                                                value: `${order.total}`,
                                                                            },
                                                                        },
                                                                    ],
                                                                });
                                                            }}
                                                            onApprove={(data, actions) => {
                                                                return actions.order!.capture().then((details) => {
                                                                    onOrderCompleted(details)
                                                                    //console.log(details, ' detalles *-*-*-*-*-')
                                                                    //const name = details.payer.name!.given_name;
                                                                    //alert(`Transaction completed by ${name}`);
                                                                });
                                                            }}
                                                        />
                                                    )
                                            }
                                        </Box>
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