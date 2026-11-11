"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import { ConfigProvider, App as AntdApp } from 'antd'
import uzUZ from 'antd/locale/uz_UZ'
import { UserProvider } from '../context/UserContext'
import UserFetcher from './UserFetcher'
import AuthModalProvider from './AuthModalProvider'

export default function AppProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                locale={uzUZ}
                theme={{
                    token: {
                        colorPrimary: '#4caf7d',
                        borderRadius: 10,
                    },
                }}
            >
                {/* AntdApp — message/notification tema konteksti uchun.
                    component={false} — qo'shimcha wrapper div CHIQARMAYDI,
                    aks holda antd'ning global `a {color}` uslubi barcha
                    linklarni ko'k rangga bo'yab qo'yardi */}
                <AntdApp component={false}>
                    <UserProvider>
                        <AuthModalProvider>
                            <UserFetcher />
                            {children}
                        </AuthModalProvider>
                    </UserProvider>
                </AntdApp>
            </ConfigProvider>
        </QueryClientProvider>
    )
}
