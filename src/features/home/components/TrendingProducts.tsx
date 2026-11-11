import ProductCard from '@/src/components/Card'
import { getTrendingProducts } from '@/src/services/getTrendingProduct'
import React from 'react'
import { ProductType } from '../../categories/types/products'
import SectionHeader from './SectionHeader'

export default async function TrendingProducts() {
    const data = await getTrendingProducts()

    if (!data?.length) return null

    return (
        <section className='mx-auto flex w-full max-w-310 flex-col justify-center gap-8 px-4 pb-25'>
            <SectionHeader
                title="Top mahsulotlar"
                subtitle="Hozir eng ko'p qidirilayotgan mahsulotlar"
                href="/products?sort=top&page=1&limit=20"
            />
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4'>
                {
                    data?.map((item: ProductType) => <ProductCard key={item?.id} product={item} />)
                }
            </div>
        </section>
    )
}
