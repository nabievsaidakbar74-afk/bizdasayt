import { getBrands } from '@/src/services/getBrands'
import React from 'react'
import BrandsList from './BrandsList'
import SectionHeader from './SectionHeader'

export default async function StartExpolingNow() {
    const data = await getBrands()

    if (!data?.length) return null

    return (
        <section className='mx-auto flex w-full max-w-310 flex-col justify-center gap-8 px-4 pb-25'>
            <SectionHeader
                title="Barcha brendlar"
                subtitle="Rasmiy va ishonchli brendlar mahsulotlari"
            />
            <div>
                <BrandsList brands={data} />
            </div>
        </section>
    )
}
