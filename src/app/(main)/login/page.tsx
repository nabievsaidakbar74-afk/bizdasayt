import { redirect } from 'next/navigation'
import { pageMeta } from '@/src/lib/seo'

export const metadata = pageMeta("Kirish", "Bizda hisobiga kirish yoki ro‘yxatdan o‘tish.", "/login")

export default function Login() {
  // Kirish header dagi modal orqali amalga oshiriladi
  redirect('/')
}
