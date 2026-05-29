import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {

    const { id } = useParams()

    const { products } = useSelector((store) => store.product)

    const product = products.find(
        (item) => item._id === id
    )

    if (!product) {
        return <h1 className='pt-20 text-center'>Loading...</h1>
    }

    return (
        <div className='pt-20 py-10 max-w-7xl mx-auto'>

            <Breadcrums product={product} />

            <div className='mt-10 grid grid-cols-2 items-start gap-10'>

                <ProductImg images={product.productImg} />

                <ProductDesc product={product} />

            </div>

        </div>
    )
}

export default SingleProduct