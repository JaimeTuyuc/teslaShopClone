
import React from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250},
    { field: 'email', headerName: 'Email', width: 250},
    { field: 'name', headerName: 'Name', width: 250},
    { field: 'total', headerName: 'Total', width: 140 },
    {
        field: 'isPaid',
        headerName: 'Paid',
        renderCell: ({ row }: GridRenderCellParams) => { 
            return row.isPaid 
            ? ( <Chip variant='outlined' label='Paid' color='success' />)
            : ( <Chip variant='outlined' label='Pending' color='error' />)
        }
    },
    { field: 'noProducts', headerName: 'No. Products', width: 100 },
    {
        field: 'check',
        headerName: 'See order',
        renderCell: ({ row }: GridRenderCellParams) => { 
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
                    See Order
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Created At', width: 250}
]

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>(`/api/admin/orders`)
    
    if (!data && !error) return <></>
    
    const rows = data!.map((order) => ({
        id: order._id,
        email: order.user!.email,
        name: order.user!.name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        chek: order._id,
        createdAt: order.createdAt
    }))

    return (
        <AdminLayout
            title='Orders'
            subtitle='All users orders'
            icon={<ConfirmationNumberOutlined /> }
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={ columns }
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default OrdersPage
