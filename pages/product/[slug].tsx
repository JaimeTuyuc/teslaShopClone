import React from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts';
import { ProductSlide, SizeSelector } from '../../components/products'
import { ItemCounter } from '@/components/ui';
import { IProduct } from '../../interfaces/products';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { dbProduct } from '@/database';

interface Props {
    product: IProduct
}

const ProductPage:NextPage<Props> = ({ product }) => {

    return (
        <>
            <ShopLayout
                title={product.title}
                pageDescription={product.description}
            >

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={7}>
                        <ProductSlide images={product.images} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Box display='flex' flexDirection='column'>
                            {/**Titulos */}
                            <Typography variant='h1' component='h1'>{product.title}</Typography>
                            <Typography variant='subtitle1' >${product.price}</Typography>

                            {/**Cantidad */ }
                            <Box sx={{ my: 2 }}>
                                <Typography variant='subtitle1'>Quantity</Typography>
                                {/**Item Quantity */}
                                <ItemCounter />
                                <SizeSelector
                                    sizes={product.sizes}
                                //    selectedSize={product.sizes[0]}
                                />
                            </Box>

                            {/**Add to cart */}
                            <Button color='secondary' className='circular-btn'>
                                Add to cart
                            </Button>

                            {/*<Chip label='No units available' color='error' variant='outlined' />*/}
                            {/**Description */}
                            <Box>
                                <Typography variant='subtitle2'>Description</Typography>
                                <Typography variant='body2'>{product.description}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const proudctSlugs = await dbProduct.getAllproductSlugs()

    return {
        paths: proudctSlugs.map((obj) => {
            return {
                params: {
                    slug: obj.slug
                }
            }
        }),
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    
    const { slug } = params as { slug: string }
    const product = await dbProduct.getProductBySlug(slug)
    
    if (!product) {
        return { 
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product: product
        },
        revalidate: 60 * 60 * 24
    }
}


/*
export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { slug } = params as { slug: string }
    const product = await dbProduct.getProductBySlug(slug)

    // Redirigir al usuario a la pagina pricipal si no hay productos
    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props :{ 
            product: product
        }
    }
}
*/

export default ProductPage