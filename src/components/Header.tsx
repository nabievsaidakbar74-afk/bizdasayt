"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiSearch } from "react-icons/fi"
import { SlBasket } from "react-icons/sl"
import { useQuery } from '@tanstack/react-query'
import api from '../services/api/api'
import { Category } from '../features/categories/types/categoryes'
import { useMounted } from '../hooks/useMounted'
import Register from './Register'
import Wishlist from './Wishlist'
import Cart from './Cart'

const navLinks = [
  { title: "Bosh sahifa", href: "/" },
  { title: "Mahsulotlar", href: "/products" },
  { title: "Biz haqimizda", href: "/about" },
]

export default function Header() {
  const [search, setSearch] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  // Kategoriyalar client'da yuklanadi — hydration tugagunga qadar
  // server bilan bir xil (bo'sh) ko'rsatamiz
  const mounted = useMounted()

  const { data: categories } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () =>
      api.get("/categories").then((res) => res?.data?.data ?? res?.data),
    staleTime: 60 * 60 * 1000,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = search.trim()
    router.push(
      query
        ? `/products?search=${encodeURIComponent(query)}&page=1&limit=20`
        : "/products?page=1&limit=20",
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      {/* Yuqori qator: logo, qidiruv, ikonkalar */}
      <div className="mx-auto flex h-18 w-full max-w-310 items-center gap-3 px-4 sm:gap-5">
        <Link href="/" className="shrink-0">
          <Image
            src="/img/logo.png"
            alt="Bizda"
            width={130}
            height={47}
            priority
            style={{ height: 40, width: "auto" }}
          />
        </Link>

        {/* Qidiruv */}
        <form
          onSubmit={onSubmit}
          className="mx-auto hidden w-full max-w-md items-center gap-1 rounded-full bg-[#eaf8e7] py-1 pl-4 pr-1 transition focus-within:bg-[#d9f2d2] sm:flex"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Mahsulot qidirish..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Qidirish"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 transition hover:text-[#399765]"
          >
            <FiSearch size={16} />
          </button>
        </form>

        {/* Ikonkalar */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Wishlist />
         <Cart/>
          <Register />
        </div>
      </div>

      {/* Pastki qator: navigatsiya va kategoriyalar */}
      <div className="border-t border-gray-100">
        <div className="scrollbar-hide mx-auto flex h-11 w-full max-w-310 items-center gap-1 overflow-x-auto px-4">
          {navLinks.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "text-[#399765]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.title}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-[#4caf7d]" />
                )}
              </Link>
            )
          })}

          {mounted && Array.isArray(categories) && categories.length > 0 && (
            <>
              <span className="mx-2 h-4 w-px shrink-0 bg-gray-200" />
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
                    pathname === `/products/${cat.slug}`
                      ? "font-medium text-[#399765]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
