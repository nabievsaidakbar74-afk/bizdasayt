"use client"
import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useGetWishlist } from '../hooks/useGetWishlist'
import { useMounted } from '../hooks/useMounted'
import { hasToken } from '../lib/auth'

export default function Wishlist() {
    const { data } = useGetWishlist()
    const mounted = useMounted()
    // Badge faqat mount'dan keyin va token bo'lganda (logout'da eski son qolmaydi)
    const count = mounted && hasToken() ? (data?.data?.items?.length ?? 0) : 0

    return (
        <Link
            href="/wishlist"
            aria-label="Sevimlilar"
            className='relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-[#4caf7d] hover:text-[#399765]'
        >
            <Heart size={17} />
            {count > 0 && (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4caf7d] px-1 text-[11px] font-bold text-white'>
                    {count}
                </span>
            )}
        </Link>
    )
}
