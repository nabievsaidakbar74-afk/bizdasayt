"use client"

import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { App } from 'antd'

export default function ContactPage() {
    const { message } = App.useApp()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        message.success("Xabaringiz yuborildi, tez orada javob beramiz")
        e.currentTarget.reset()
    }

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4caf7d] focus:ring-2 focus:ring-green-100"

    return (
        <main className="mx-auto w-full max-w-310 px-4 py-10 lg:py-14">
            <div className="mx-auto max-w-2xl text-center">
                <span className="rounded-full bg-[#edf8ee] px-4 py-2 text-sm font-semibold text-[#42a574]">
                    Bog'lanish
                </span>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Savolingiz bormi? Biz yozing
                </h1>
                <p className="mt-4 text-gray-500">
                    Quyidagi forma orqali murojaat qiling yoki to'g'ridan-to'g'ri bog'laning.
                </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.2fr]">
                {/* Aloqa ma'lumotlari */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf8ee] text-[#399765]">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Telefon</p>
                            <p className="mt-1 text-sm text-gray-500">+998 90 123 45 67</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf8ee] text-[#399765]">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Email</p>
                            <p className="mt-1 text-sm text-gray-500">support@bizda.uz</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf8ee] text-[#399765]">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Manzil</p>
                            <p className="mt-1 text-sm text-gray-500">Toshkent sh., O'zbekiston</p>
                        </div>
                    </div>
                </div>

                {/* Forma */}
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input required placeholder="Ismingiz" className={inputClass} />
                        <input required type="email" placeholder="Email manzilingiz" className={inputClass} />
                    </div>
                    <input placeholder="Mavzu" className={inputClass} />
                    <textarea
                        required
                        placeholder="Xabaringiz..."
                        rows={5}
                        className={`${inputClass} resize-none`}
                    />
                    <button
                        type="submit"
                        className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4caf7d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#399765]"
                    >
                        <Send size={16} />
                        Yuborish
                    </button>
                </form>
            </div>
        </main>
    )
}
