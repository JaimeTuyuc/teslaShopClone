import React, { FC } from 'react'
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { Typography } from '@mui/material';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const KidsPage:FC = () => {
    const { products, isLoading, isError } = useProducts(`products?gender=kid`)
    return (
        <>
            <ShopLayout
                title={`Teslo Shop - Kids`}
                pageDescription={`Our selected merch for kid's`}
            >
                <Typography variant='h1' component='h1'>Kids</Typography>
                <Typography variant='h2' sx={{ mb : 1}}>All our Kid's products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                } 
            </ShopLayout>
        </>
    )
}

export default KidsPage