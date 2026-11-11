"use client"

import Image from 'next/image'
import Link from 'next/link'
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin, FaSquareInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

const companyLinks = [
    { label: "Biz haqimizda", href: "/about" },
    { label: "Mahsulotlar", href: "/products" },
    { label: "Karyera", href: "/about" },
    { label: "Yangiliklar", href: "/about" },
]

const supportLinks = [
    { label: "Bog'lanish", href: "/contact" },
    { label: "Yordam markazi (FAQ)", href: "/contact" },
    { label: "Buyurtmani kuzatish", href: "/account/orders" },
    { label: "Qaytarish siyosati", href: "/contact" },
    { label: "Yetkazib berish", href: "/contact" },
]

export default function Footer() {

    const emailPush = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <footer className='bg-[rgba(234,248,231,1)]'>
            <div className='mx-auto grid w-full max-w-310 grid-cols-1 gap-10 px-4 pb-12 pt-14 sm:grid-cols-2 lg:grid-cols-4'>
                {/* Logo va ijtimoiy tarmoqlar */}
                <div className='flex flex-col gap-5'>
                    <Link href="/">
                        <Image
                            src="/img/logo.png"
                            alt="Bizda"
                            width={150}
                            height={54}
                            style={{ height: 44, width: "auto" }}
                        />
                    </Link>
                    <p className='max-w-64 text-sm leading-6 text-gray-600'>
                        Eng yaxshi takliflar va chegirmalar bir joyda. Qulay narxlar, tez yetkazib berish.
                    </p>
                    <div>
                        <p className='font-medium text-[15px]'>Biz bilan bog'laning</p>
                        <div className='flex gap-3 pt-3'>
                            <FaFacebook className='h-6 w-6 cursor-pointer text-blue-700 transition hover:scale-110' />
                            <FaSquareInstagram className='h-6 w-6 cursor-pointer text-orange-500 transition hover:scale-110' />
                            <BsTwitterX className='h-6 w-6 cursor-pointer text-black transition hover:scale-110' />
                            <FaLinkedin className='h-6 w-6 cursor-pointer text-blue-700 transition hover:scale-110' />
                        </div>
                    </div>
                </div>

                {/* Kompaniya */}
                <div>
                    <p className='pb-5 text-[17px] font-medium'>Kompaniya</p>
                    <ul className='flex flex-col gap-3.5'>
                        {companyLinks.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className='text-sm text-gray-700 transition hover:text-[#399765]'>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Yordam */}
                <div>
                    <p className='pb-5 text-[17px] font-medium'>Mijozlarga yordam</p>
                    <ul className='flex flex-col gap-3.5'>
                        {supportLinks.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className='text-sm text-gray-700 transition hover:text-[#399765]'>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className='flex flex-col gap-4'>
                    <p className='text-[17px] font-medium text-[rgba(78,166,116,1)]'>Yangiliklarga obuna</p>
                    <p className='text-sm leading-6 text-gray-600'>
                        Chegirmalar va yangi mahsulotlar haqida birinchilardan bo'lib xabardor bo'ling.
                    </p>
                    <form
                        onSubmit={emailPush}
                        className='flex items-center justify-center rounded-full bg-[rgba(193,230,186,1)] p-1 transition-all duration-300 focus-within:bg-[#c2f4b9]'>
                        <input
                            type="email"
                            required
                            placeholder='Email manzilingiz'
                            className='w-full bg-transparent p-[2px_12px] text-sm outline-none'
                        />
                        <button type='submit' className='shrink-0 cursor-pointer rounded-full bg-white p-[8px_20px] text-sm font-medium transition hover:text-[#399765]'>
                            Obuna
                        </button>
                    </form>
                </div>
            </div>

            <div className='border-t border-[rgba(78,166,117,1)]'>
                <div className='mx-auto flex w-full max-w-310 flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:text-left'>
                    <p className='text-sm text-[rgba(0,0,0,0.5)]'>© 2026 Bizda. Barcha huquqlar himoyalangan</p>
                    <p className='text-sm text-[rgba(0,0,0,0.5)]'>SSL Secure orqali himoyalangan</p>
                </div>
            </div>
        </footer>
    )
}
