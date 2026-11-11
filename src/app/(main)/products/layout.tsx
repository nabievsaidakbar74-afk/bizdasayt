import Breadcrumb from '@/src/features/products/components/Breadcrumb'
import React, { ReactNode } from 'react'

export default function ProductsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-310 px-4 pt-4">
            <Breadcrumb/>
            {children}
        </div>
    )
}
