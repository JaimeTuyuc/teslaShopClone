import React, { FC } from 'react'
import { ProductList } from '@/components/products';
import { ShopLayout } from '../../components/layouts';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '@/components/ui';
import { Typography } from '@mui/material';


const ManPage:FC = () => {
    const { products, isLoading, isError } = useProducts(`products?gender=men`)
    return (
        <>
            <ShopLayout
                title={`Teslo Shop - Man`}
                pageDescription={`Our selected merch for man's`}
            >
                <Typography variant='h1' component='h1'>Mans</Typography>
                <Typography variant='h2' sx={{ mb : 1}}>All our man's products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                }   
            </ShopLayout>
        </>
    )
}

export default ManPage