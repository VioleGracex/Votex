"use client";
import React, { useState } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import AuthPopup from "../modals/AuthPopup";

const Navbar = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(null); // State to manage popup type

  const toggleAccordion = () => setIsAccordionOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const toggleLoginModal = () => setShowPopup('login');  // Set the popup type to 'login'
  const toggleRegisterModal = () => setShowPopup('register');  // Set the popup type to 'register'

  const navLinks = [
    { path: "/", label: "Главная" },
    { path: "/features", label: "Функции" },
    { path: "/pricing", label: "Цены" },
  ];

  const accordionLinks = [
    {
      category: "Исследуйте наши страницы",
      links: [
        { path: "/feedback-tools", label: "Инструменты обратной связи", description: "Узнайте, как Votex может улучшить ваш сбор отзывов." },
        { path: "/user-insights", label: "Пользовательские инсайты", description: "Анализируйте поведение и предпочтения пользователей." },
        { path: "/community-engagement", label: "Взаимодействие с сообществом", description: "Создавайте и поддерживайте активное сообщество." },
        { path: "/support-center", label: "Центр поддержки", description: "Получите помощь и поддержку." },
      ],
    },
    {
      category: "Другие полезные ссылки",
      links: [
        { path: "/blog-updates", label: "Обновления блога", description: "Будьте в курсе последних новостей." },
        { path: "/case-studies", label: "Кейсы", description: "Изучите наши успешные проекты и их особенности." },
        { path: "/webinars", label: "Вебинары", description: "Посещайте сеансы с участием экспертов." },
        { path: "/documentation", label: "Документация", description: "Получите доступ к подробным руководствам и справочникам." },
      ],
    },
  ];

  return (
    <Router>
      <nav className=" z-9999 py-4 sm:py-0 dark:bg-black dark:text-white duration-300">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Image src="/assets/votex-logo-trash.png" alt="Логотип" width={70} height={55} />

          {/* Переключение мобильного меню */}
          <button
            className="sm:hidden text-black dark:text-white"
            onClick={toggleMobileMenu}
            aria-label="Переключить меню"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Ссылки для настольной версии */}
          <div className="hidden sm:flex gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className="text-black group">
                {link.label}
                <span className="block h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </NavLink>
            ))}
            <button onClick={toggleAccordion} className="text-black flex items-center gap-2">
              Ресурсы {isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          <div className="hidden sm:flex gap-4">
            <button onClick={toggleLoginModal} className="group">Войти</button>
            <button onClick={toggleRegisterModal} className="group">Регистрация</button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-900">
            <div className="flex flex-col gap-4 p-4">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className="text-black">
                  {link.label}
                </NavLink>
              ))}
              <button onClick={toggleAccordion} className="flex items-center gap-2">
                Ресурсы {isAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            <div className={`transition-all duration-300 ${isAccordionOpen ? 'block' : 'hidden'}`}>
              {accordionLinks.map((section) => (
                <div key={section.category} className="mb-4">
                  <h3 className="font-semibold">{section.category}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.path} className="flex flex-col">
                        <NavLink to={link.path} className="font-semibold">{link.label}</NavLink>
                        <span className="text-sm">{link.description}</span>
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
          <div className="absolute mx-auto z-9999 self-stretch bg-gray-100 p-8">
            <div className="flex justify-around">
              {accordionLinks.map((section) => (
                <div key={section.category} className="flex-col gap-4">
                  <h3 className="text-black text-sm font-semibold">
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
                          <div className="self-stretch text-black text-base font-semibold leading-normal">
                            {link.label}
                          </div>
                          <div className="self-stretch text-black text-sm font-normal leading-[21px]">
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
      </nav>

      {/* Show AuthPopup modal based on showPopup state */}
      {showPopup && <AuthPopup type={showPopup} onClose={() => setShowPopup(null)} />}
    </Router>
  );
};

export default Navbar;
