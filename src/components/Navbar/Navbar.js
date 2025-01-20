"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaChevronDown, FaChevronUp, FaBars, FaTimes, FaUser, FaTachometerAlt } from "react-icons/fa";
import Image from "next/image";
import AuthPopup from "../modals/AuthPopup";
import ProfileDropDown from './ProfileDropDown';
import { checkIfLoggedIn, handleLogout } from '../../utils/authHelpers'; // Import the helper functions

const Navbar = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(null); // Состояние для управления всплывающим окном
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Состояние для управления меню профиля
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для управления статусом входа

  const toggleAccordion = () => setIsAccordionOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

  const toggleLoginModal = () => setShowPopup("login"); // Установить тип всплывающего окна на 'login'
  const toggleRegisterModal = () => setShowPopup("register"); // Установить тип всплывающего окна на 'register'

  useEffect(() => {
    // Проверка, вошел ли пользователь
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  const navLinks = [
    { path: "/", label: "Главная" },
    { path: "/features", label: "Функции" },
    { path: "/pricing", label: "Цены" },
  ];

  const accordionLinks = [
    {
      category: "Исследуйте наши страницы",
      links: [
        {
          path: "/feedback-tools",
          label: "Инструменты обратной связи",
          description: "Узнайте, как Votex может улучшить ваш сбор отзывов.",
        },
        {
          path: "/user-insights",
          label: "Пользовательские инсайты",
          description: "Анализируйте поведение и предпочтения пользователей.",
        },
        {
          path: "/community-engagement",
          label: "Взаимодействие с сообществом",
          description: "Создавайте и поддерживайте активное сообщество.",
        },
        {
          path: "/support-center",
          label: "Центр поддержки",
          description: "Получите помощь и поддержку.",
        },
      ],
    },
    {
      category: "Другие полезные ссылки",
      links: [
        {
          path: "/blog-updates",
          label: "Обновления блога",
          description: "Будьте в курсе последних новостей.",
        },
        {
          path: "/case-studies",
          label: "Кейсы",
          description: "Изучите наши успешные проекты и их особенности.",
        },
        {
          path: "/webinars",
          label: "Вебинары",
          description: "Посещайте сеансы с участием экспертов.",
        },
        {
          path: "/documentation",
          label: "Документация",
          description:
            "Получите доступ к подробным руководствам и справочникам.",
        },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-0 bg-white dark:bg-black dark:text-white duration-300 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Image
          src="/assets/votex-logo-trash.png"
          alt="Логотип"
          width={70}
          height={55}
          className="rounded-lg"
        />

        {/* Переключение мобильного меню */}
        <button
          className="sm:hidden text-black dark:text-white"
          onClick={toggleMobileMenu}
          aria-label="Переключить меню"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Ссылки для настольной версии */}
        <div className="hidden sm:flex md:text-xl gap-8 font-bold font-['Roboto'] leading-[57.60px]">
          {navLinks.map((link) => (
            <a key={link.path} href={link.path} className="text-black dark:text-white group">
              {link.label}
              <span className="block h-[2px] bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </a>
          ))}
          <button
            onClick={toggleAccordion}
            className="text-black dark:text-white flex items-center gap-2"
          >
            Ресурсы {isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <div className="hidden sm:flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              {/* Кнопка Панель управления */}
              <a href="/dashboard" className="flex items-center gap-2 text-black dark:text-white">
                <FaTachometerAlt size={18} />
                <span className="font-semibold">Панель управления</span>
              </a>

              {/* Выпадающее меню профиля */}
              <ProfileDropDown handleLogout={() => {
                handleLogout();
                setIsLoggedIn(false);
                setIsProfileMenuOpen(false);
              }} />
            </>
          ) : (
            <>
              <button onClick={toggleLoginModal} className="group px-6 py-2 border border-black text-black dark:text-white dark:border-white text-base font-normal font-['Roboto'] leading-normal rounded-lg">
                Войти
              </button>
              <button onClick={toggleRegisterModal} className="group px-6 py-2 border border-black text-black dark:text-white dark:border-white text-base font-normal font-['Roboto'] leading-normal rounded-lg">
                Регистрация
              </button>
            </>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 rounded-b-lg">
          <div className="flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <a key={link.path} href={link.path} className="text-black dark:text-white">
                {link.label}
              </a>
            ))}
            <button
              onClick={toggleAccordion}
              className="flex items-center gap-2 text-black dark:text-white"
            >
              Ресурсы {isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          <div
            className={`transition-all duration-300 ${
              isAccordionOpen ? "block" : "hidden"
            }`}
          >
            {accordionLinks.map((section) => (
              <div key={section.category} className="mb-4 px-4">
                <h3 className="font-semibold text-black dark:text-white">{section.category}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path} className="flex flex-col">
                      <a href={link.path} className="font-semibold text-black dark:text-white">
                        {link.label}
                      </a>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{link.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Контент аккордеона */}
      {isAccordionOpen && (
        <div className="absolute mx-auto z-9999 self-stretch bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex justify-around">
            {accordionLinks.map((section) => (
              <div key={section.category} className="flex-col gap-4">
                <h3 className="text-black dark:text-white text-sm font-semibold">
                  {section.category}
                </h3>
                <ul>
                  {section.links.map((link) => (
                    <li
                      key={link.path}
                      className="w-[312px] h-[61px] py-2 justify-start items-start gap-3 inline-flex"
                    >
                      <div className="w-6 h-6 relative overflow-hidden" />
                      <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                        <div className="self-stretch text-black dark:text-white text-base font-semibold leading-normal">
                          {link.label}
                        </div>
                        <div className="self-stretch text-black dark:text-white text-sm font-normal leading-[21px]">
                          {link.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Показать модальное окно AuthPopup на основе состояния showPopup */}
      {showPopup && (
        <AuthPopup type={showPopup} onClose={() => setShowPopup(null)} />
      )}
    </nav>
  );
};

export default Navbar;