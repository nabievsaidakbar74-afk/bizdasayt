import React from 'react'
import { Truck, ShieldCheck, BadgePercent, Headset } from 'lucide-react'

const stats = [
    { value: "10 000+", label: "Mahsulotlar" },
    { value: "5 000+", label: "Mamnun mijozlar" },
    { value: "50+", label: "Rasmiy brendlar" },
    { value: "24/7", label: "Qo'llab-quvvatlash" },
]

const features = [
    {
        icon: BadgePercent,
        title: "Qulay narxlar",
        text: "Eng yaxshi takliflar va muntazam chegirmalar.",
    },
    {
        icon: Truck,
        title: "Tez yetkazib berish",
        text: "Buyurtmangizni tez va ishonchli yetkazamiz.",
    },
    {
        icon: ShieldCheck,
        title: "Ishonchli xarid",
        text: "Mahsulotlar kafolati va oson qaytarish.",
    },
    {
        icon: Headset,
        title: "Doimiy yordam",
        text: "Har qanday savolingizga javob beramiz.",
    },
]

export default function AboutPage() {
    return (
        <main className="mx-auto w-full max-w-310 px-4 py-10 lg:py-14">
            {/* Sarlavha */}
            <div className="mx-auto max-w-2xl text-center">
                <span className="rounded-full bg-[#edf8ee] px-4 py-2 text-sm font-semibold text-[#42a574]">
                    Biz haqimizda
                </span>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Bizda — xarid qilishning qulay manzili
                </h1>
                <p className="mt-4 leading-7 text-gray-500">
                    Biz eng sifatli mahsulotlarni qulay narxlarda taklif qilamiz.
                    Maqsadimiz — har bir mijozga tez, ishonchli va yoqimli
                    xarid tajribasini taqdim etish.
                </p>
            </div>

            {/* Statistika */}
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
                    >
                        <p className="text-3xl font-bold text-[#399765]">{item.value}</p>
                        <p className="mt-2 text-sm text-gray-500">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Afzalliklar */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8ee] text-[#399765]">
                            <item.icon size={22} />
                        </div>
                        <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
