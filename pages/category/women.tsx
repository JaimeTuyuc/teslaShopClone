import React, { FC } from 'react'
import { ProductList } from '@/components/products';
import { ShopLayout } from '../../components/layouts';
import { Typography } from '@mui/material';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const WomensPage: FC = () => {
    const { products, isLoading, isError } = useProducts(`products?gender=women`)

    return (
        <>
            <ShopLayout
                title={`Teslo Shop - Woman`}
                pageDescription={`Our selected merch for woman's`}
            >
                <Typography variant='h1' component='h1'>Womens</Typography>
                <Typography variant='h2' sx={{ mb : 1}}>All our Woman's products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                } 
            </ShopLayout>
        </>
    )
}

export default WomensPage