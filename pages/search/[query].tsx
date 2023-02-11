import { FullScreenLoading } from '@/components/ui'
import { dbProduct } from '@/database'
import { Box, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'
import { IProduct } from '../../interfaces/products';

interface Props {
    products: IProduct[]
    foundProducts: boolean
    query: string
}

const SearchPage:NextPage<Props> = ({products, foundProducts, query}) => {


    return (
        <>
            <ShopLayout title={'Tesla Shop - Search'} pageDescription={'This is a Tesla e-shop search page'}>
                <Typography variant='h1' component='h1'>Search your product</Typography>
                {
                    foundProducts
                        ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='uppercase'>Your search: {query}</Typography>
                        : (
                            <>
                                <Box
                                    display='flex'

                                >
                                    <Typography variant='h2' sx={{ mb: 2 }}>No products found with</Typography>
                                    <Typography variant='h2' sx={{ mb: 2, mx: 1 }} color='secondary'>{query}</Typography>
                                </Box>
                            </>
                        )
                }
                
                <ProductList products={products} />

            </ShopLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query } = params as { query: string }
    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    
    let products
    products = await dbProduct.getAllProductByQuery(query)

    const foundProducts = products.length > 0
    if (!foundProducts) {
        // Get all default products
        products = await dbProduct.getAllProductsDefault()
    }

    return {
        props: {
            products: products,
            foundProducts: foundProducts,
            query: query
        }
    }
}

export default SearchPage