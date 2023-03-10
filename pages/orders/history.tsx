import React from 'react'
import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrder } from '@/database';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Name', width: 300 },
    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Show info about the order',
        width: 200,
        renderCell(params) {
            return (
                <Chip color={ params.row.paid ? 'success' : 'error'} label={ params.row.paid ? 'Paid' : 'Non paid'} variant='outlined' />
            )
            
        }
    },
    {
        field: 'order',
        headerName: 'Orders',
        description: 'Info about all your orders',
        width: 200,
        sortable: false,
        renderCell(params) {
            return (
                <Link href={`/orders/${params.row.orderId}`}>{params.row.orderId}</Link>
            )
            
        }
    }
]

/*const rows = [
    { id: 1, paid: true, fullName: 'James Tuyuc 0', orderId: 'sdfajsad4f53aefa3' },
    { id: 2, paid: false, fullName: 'James Tuyuc 1', orderId: 'sdfajsad4f53aefa3' },
    { id: 3, paid: true, fullName: 'James Tuyuc 2', orderId: 'sdfajsad4f53aefa3' },
    { id: 4, paid: false, fullName: 'James Tuyuc 3', orderId: 'sdfajsad4f53aefa3' },
    { id: 5, paid: true, fullName: 'James Tuyuc 4', orderId: 'sdfajsad4f53aefa3' },
    { id: 6, paid: true, fullName: 'James Tuyuc 5', orderId: 'sdfajsad4f53aefa3' },
    { id: 7, paid: false, fullName: 'James Tuyuc 6', orderId: 'sdfajsad4f53aefa3' },
    { id: 8, paid: false, fullName: 'James Tuyuc 7', orderId: 'sdfajsad4f53aefa3' },
    { id: 9, paid: true, fullName: 'James Tuyuc 8', orderId: 'sdfajsad4f53aefa3' },
    { id: 10, paid: false, fullName: 'James Tuyuc 9', orderId: 'sdfajsad4f53aefa3' },
    {id: 11, paid: true, fullName: 'James Tuyuc 10', orderId: 'sdfajsad4f53aefa3' }
]*/

interface Props {
    orders: IOrder[]
}

const HistoryPage:NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullName: order.shippingAddress.firstName + order.shippingAddress.lastName,
        orderId: order._id
    }))

    return (
        <>
            <ShopLayout
                title='Order history'
                pageDescription='All your orders'
            >
                <Typography variant='h1' component='h1'>Your Order History</Typography>

                <Grid container>
                    <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                        <DataGrid
                            columns={columns}
                            rows={rows} 
                            pageSize={10}
                            rowsPerPageOptions={ [10]}
                        />
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session: any = await getSession({req})
    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrder.getOrdersByuser(session.user._id)

    return {
        props: {
            orders
        }
    }
} 

export default HistoryPage