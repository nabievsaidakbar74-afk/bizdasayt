import React from 'react'
import { ProductType } from '../../categories/types/products'
import ProductCard from '@/src/components/Card'
import { getBestSelling } from '@/src/services/getBestSelling'
import SectionHeader from './SectionHeader'

export default async function BestSelling() {
    const data = await getBestSelling()

    if (!data?.length) return null

    return (
        <section className='mx-auto flex w-full max-w-310 flex-col justify-center gap-8 px-4 pb-25'>
            <SectionHeader
                title="Ko'p sotilganlar"
                subtitle="Xaridorlar eng ko'p tanlayotgan mahsulotlar"
                href="/products?sort=best-selling&page=1&limit=20"
            />
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4'>
                {
                    data?.map((item: ProductType) => <ProductCard key={item?.id} product={item} />)
                }
            </div>
        </section>
    )
}
