import { FullScreenLoading } from '@/components/ui'
import { Typography } from '@mui/material'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { useProducts } from '../hooks'


export default function HomePage() {

  const { products, isLoading } = useProducts('products')

  return (
    <>
      <ShopLayout title={'Tesla Shop - Home'} pageDescription={'This is a Tesla e-shop clone'}>
        <Typography variant='h1' component='h1'>Store</Typography>
        <Typography variant='h2' sx={{ mb : 1}}>All our products</Typography>

        {
          isLoading 
            ? <FullScreenLoading />
            :  <ProductList products={products} />
        }
      </ShopLayout>
    </>
  )
}
