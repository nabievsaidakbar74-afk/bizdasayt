"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Button, Form, Input, Modal, Spin } from "antd";
import {
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaTruck,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { useRegister } from "../hooks/useRegister";
import { useLogin } from "../hooks/useLogin";

type AuthTab = "login" | "register";

type AuthModalContextType = {
  /** Login/register modalini ochadi (masalan, 401 xatolikda) */
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalContextType>({
  openAuth: () => {},
  closeAuth: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

type LoginValues = {
  login: string;
  email: string;
  password: string;
};

const benefits = [
  {
    icon: <FaBoxOpen size={17} />,
    title: "Bozorga borishga hojat yo'q",
    description: "Qulay narxlar va uyga yetkazib berish",
  },
  {
    icon: <FaTruck size={17} />,
    title: "Tez yetkazib berish",
    description: "Buyurtmangiz tez va ishonchli yetkaziladi",
  },
  {
    icon: <FaCheckCircle size={17} />,
    title: "Siz uchun qulayliklar",
    description: "Qulay rasmiylashtirish va qaytarish kafolati",
  },
  {
    icon: <FaMoneyBillWave size={17} />,
    title: "Yetkazilganda to'lov",
    description: "Onlayn to'lov yo'q, mahsulot yetib borgach to'laysiz",
  },
];

export default function AuthModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const { register, isPending } = useRegister();
  const { login, isPending: isLoginPending } = useLogin();

  const [loginForm] = Form.useForm<LoginValues>();
  const [registerForm] = Form.useForm<RegisterValues>();

  const openAuth = useCallback((tab: AuthTab = "login") => {
    setActiveTab(tab);
    setIsModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsModalOpen(false), []);

  const handleLogin = (values: LoginValues) => {
    login(values, {
      onSuccess: () => {
        closeAuth();
        loginForm.resetFields();
      },
    });
  };

  const handleRegister = (values: RegisterValues) => {
    register(values, {
      onSuccess: () => {
        setActiveTab("login");
        registerForm.resetFields();
      },
    });
  };

  const inputClass =
    "!h-[42px] !rounded-xl !border !border-[#d1d5df] !text-sm hover:!border-[#4caf7d]";

  const labelClass = "text-[13px] font-medium text-[#626b7c]";

  const renderLoginForm = () => (
    <Form<LoginValues>
      form={loginForm}
      layout="vertical"
      requiredMark={false}
      onFinish={handleLogin}
    >
      <Form.Item
        label={<span className={labelClass}>Email</span>}
        name="email"
        rules={[
          { required: true, message: "Emailni kiriting" },
          { type: "email", message: "Email noto'g'ri" },
        ]}
      >
        <Input
          prefix={<FaEnvelope className="mr-1 text-gray-400" />}
          placeholder="example@gmail.com"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={<span className={labelClass}>Parol</span>}
        name="password"
        rules={[{ required: true, message: "Parolni kiriting" }]}
      >
        <Input.Password
          prefix={<FaLock className="mr-1 text-gray-400" />}
          placeholder="Parolingiz"
          className={inputClass}
        />
      </Form.Item>

      <Button
        disabled={isLoginPending}
        htmlType="submit"
        type="primary"
        block
        className="!mt-1 !h-[44px] !rounded-xl !text-[15px] !font-semibold"
      >
        {isLoginPending ? <Spin /> : "Kirish"}
      </Button>

      <p className="mb-0 mt-4 text-center text-xs text-gray-500">
        Hisobingiz yo'qmi?{" "}
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className="cursor-pointer font-semibold text-[#399765] transition hover:text-[#4caf7d]"
        >
          Ro'yxatdan o'tish
        </button>
      </p>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form<RegisterValues>
      form={registerForm}
      layout="vertical"
      requiredMark={false}
      onFinish={handleRegister}
    >
      <div className="grid grid-cols-2 gap-3">
        <Form.Item
          label={<span className={labelClass}>Ism</span>}
          name="firstName"
          rules={[{ required: true, message: "Ismni kiriting" }]}
        >
          <Input placeholder="Ali" className={inputClass} />
        </Form.Item>

        <Form.Item
          label={<span className={labelClass}>Familiya</span>}
          name="lastName"
          rules={[{ required: true, message: "Familiyani kiriting" }]}
        >
          <Input placeholder="Karimov" className={inputClass} />
        </Form.Item>
      </div>

      <Form.Item
        label={<span className={labelClass}>Email</span>}
        name="email"
        rules={[
          { required: true, message: "Emailni kiriting" },
          { type: "email", message: "Email noto'g'ri" },
        ]}
      >
        <Input
          prefix={<FaEnvelope className="mr-1 text-gray-400" />}
          placeholder="ali@example.com"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={<span className={labelClass}>Telefon</span>}
        name="phone"
        rules={[
          { required: true, message: "Telefonni kiriting" },
          { pattern: /^\+998\d{9}$/, message: "Masalan: +998901234567" },
        ]}
      >
        <Input
          prefix={<FaPhoneAlt className="mr-1 text-gray-400" />}
          placeholder="+998901234567"
          className={inputClass}
        />
      </Form.Item>

      <Form.Item
        label={<span className={labelClass}>Parol</span>}
        name="password"
        rules={[
          { required: true, message: "Parolni kiriting" },
          { min: 8, message: "Kamida 8 ta belgi kiriting" },
        ]}
      >
        <Input.Password
          prefix={<FaLock className="mr-1 text-gray-400" />}
          placeholder="Kamida 8 ta belgi"
          className={inputClass}
        />
      </Form.Item>

      <Button
        disabled={isPending}
        htmlType="submit"
        type="primary"
        block
        className="!h-[44px] !rounded-xl !text-[15px] !font-semibold"
      >
        {isPending ? <Spin /> : "Hisob yaratish"}
      </Button>

      <p className="mb-0 mt-4 text-center text-xs text-gray-500">
        Hisobingiz bormi?{" "}
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className="cursor-pointer font-semibold text-[#399765] transition hover:text-[#4caf7d]"
        >
          Kirish
        </button>
      </p>
    </Form>
  );

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}

      <Modal
        open={isModalOpen}
        onCancel={closeAuth}
        footer={null}
        centered
        width={860}
        destroyOnHidden
        closable={false}
        styles={{
          container: {
            padding: 0,
            overflow: "hidden",
            borderRadius: 20,
          },
          body: {
            padding: 0,
            overflow: "hidden",
          },
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr]">
          {/* Brend paneli */}
          <aside className="relative hidden flex-col overflow-hidden bg-gradient-to-br from-[#4caf7d] via-[#3d9c6c] to-[#2e7d54] p-8 text-white md:flex">
            {/* Dekorativ halqalar */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute right-10 top-1/2 h-20 w-20 rounded-full border-[14px] border-white/10" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="inline-flex w-fit items-center rounded-xl bg-white px-3 py-2">
                <Image
                  src="/img/logo.png"
                  alt="Bizda"
                  width={110}
                  height={40}
                  style={{ height: 30, width: "auto" }}
                />
              </div>

              <h2 className="mt-9 text-[26px] font-bold leading-snug">
                Xarid qilishning eng qulay manzili
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Hisobingizga kiring yoki ro'yxatdan o'ting va barcha
                imkoniyatlardan foydalaning.
              </p>

              <div className="mt-9 flex flex-col gap-5">
                {benefits.map((item) => (
                  <div key={item.title} className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Forma paneli */}
          <section className="relative px-6 py-8 sm:px-9">
            <button
              type="button"
              onClick={closeAuth}
              aria-label="Yopish"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
            >
              <FaTimes size={13} />
            </button>

            <div className="text-center">
              <h2 className="text-[24px] font-extrabold tracking-tight text-[#11182d]">
                Xush kelibsiz! 👋
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {activeTab === "login"
                  ? "Hisobingizga kirish uchun ma'lumotlarni kiriting"
                  : "Bizda bilan xarid qilishni boshlang"}
              </p>
            </div>

            {/* Tab almashtirgich */}
            <div className="mt-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`cursor-pointer rounded-lg py-2.5 text-sm font-semibold transition ${
                  activeTab === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Kirish
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`cursor-pointer rounded-lg py-2.5 text-sm font-semibold transition ${
                  activeTab === "register"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            <div className="mt-5">
              {activeTab === "login" ? renderLoginForm() : renderRegisterForm()}
            </div>

            <p className="mb-0 mt-4 text-center text-[10px] leading-4 text-gray-400">
              Davom etish orqali foydalanish shartlariga rozilik bildirasiz.
            </p>
          </section>
        </div>
      </Modal>
    </AuthModalContext.Provider>
  );
}
