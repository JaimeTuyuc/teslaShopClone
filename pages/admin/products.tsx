
import React from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IProduct } from '@/interfaces';
import Link from 'next/link';

const columns: GridColDef[] = [
    {
        field: 'image',
        headerName: 'Product Image',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
                    <CardMedia
                        component='img'
                        className='fadeIn'
                        alt={row.slug}
                        image={ row.image}
                    />
                </a>
            )
        }
    },
    {
        field: 'title',
        headerName: 'Product title',
        width: 250,
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <Link
                    href={`/admin/products/${row.slug}`}
                >
                    { row.title }
                </Link>
            )
        }
    },
    { field: 'gender', headerName: 'Gender' },
    { field: 'type', headerName: 'Type' },
    { field: 'inStock', headerName: 'In Stock' },
    { field: 'price', headerName: 'Price' },
    { field: 'sizes', headerName: 'Sizes', width: 250 },
]

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>(`/api/admin/products`)

    if (!data && !error) return <></>

    const rows = data!.map((product) => ({
        id: product._id,
        image: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }))

    return (
        <AdminLayout
            title={`Products - (${rows.length})`}
            subtitle='Manage products'
            icon={<CategoryOutlined />}
        >
            <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Add New Product
                </Button>
            </Box>
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default ProductsPage
