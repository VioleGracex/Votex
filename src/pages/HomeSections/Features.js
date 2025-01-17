import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  GiSettingsKnobs,
  GiNewspaper,
  GiLockedChest,
  GiLightBulb,
} from "react-icons/gi";
import AuthPopup from "@/components/modals/AuthPopup";

// Массив с данными функций
const features = [
  {
    icon: <GiSettingsKnobs className="text-black w-8 h-8" />,
    heading: "Продвинутая фильтрация и сортировка",
    text: "Легко находите отзывы по категориям, статусам и другим параметрам.",
  },
  {
    icon: <GiNewspaper className="text-black w-8 h-8" />,
    heading: "Будьте в курсе с дорожными картами и заметками о релизах",
    text: "Держите пользователей в курсе будущих функций и обновлений.",
  },
  {
    icon: <GiLockedChest className="text-black w-8 h-8" />,
    heading: "Управление пользователями и контроль конфиденциальности",
    text: "Просто управляйте ролями пользователей и видимостью досок.",
  },
  {
    icon: <GiLightBulb className="text-black w-8 h-8" />,
    heading: "Преобразуйте отзывы в полезные инсайты",
    text: "Используйте мнения пользователей для стимуляции инноваций и роста.",
  },
];

// Класс для стилей элементов функций
const featureItemClass =
  "flex flex-col justify-start items-start gap-6 min-w-[150px] max-w-[380px] w-full md:w-[45%] lg:w-[30%] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl";
  const Features = ({ togglePlay }) => {
    const [showPopup, setShowPopup] = useState(null); // State to manage the popup type
  
    const toggleRegisterModal = () => setShowPopup("register"); // Open register modal
    const toggleLoginModal = () => setShowPopup("login"); // Open login modal
  
    return (
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="relative mx-auto px-16 md:px-64 py-28  flex flex-col md:flex-row justify-center items-center gap-20 overflow-hidden">
          {/* Left Section */}
          <div data-aos="fade-up" className="w-full md:w-[380px] flex-col justify-start items-start gap-8 flex">
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="text-black text-base font-semibold font-['Roboto'] leading-normal">
                Возможности
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-6">
              <div className="text-black text-3xl md:text-5xl font-bold font-['Roboto'] leading-[57.60px]">
                Изучите наши мощные инструменты для управления обратной связью
              </div>
              <div className="text-black text-lg font-normal font-['Roboto'] leading-[27px]">
                Votex предлагает набор функций для улучшения управления отзывами. От продвинутой фильтрации до управления пользователями — у нас есть всё необходимое для вашего успеха.
              </div>
            </div>
            <div className="flex justify-start items-center gap-6">
              <div className="px-6 py-3 border border-black text-black text-base font-normal font-['Roboto'] leading-normal transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer">
                Подробнее
              </div>
              <div className="flex justify-center items-center leading-normal transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                <button className="text-black text-base font-normal font-['Roboto']" onClick={toggleRegisterModal}>
                  Регистрация
                </button>
                <div className="w-6 h-6 relative overflow-hidden">
                  <FaChevronRight className="text-black mt-1" />
                </div>
              </div>
            </div>
          </div>
  
          {/* Right Section (Feature List) */}
          <div data-aos="fade-up" className="flex-grow flex-col justify-start items-start gap-16">
            <div className="flex flex-wrap justify-start items-start gap-12">
              {features.slice(0, 2).map((feature, index) => (
                <div key={index} className={`${featureItemClass} min-w-[300px] mb-8`}>
                  <div className="w-12 h-12 relative overflow-hidden">{feature.icon}</div>
                  <div className="text-black text-2xl md:text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                    {feature.heading}
                  </div>
                  <div className="text-black text-base font-normal font-['Roboto'] leading-normal">
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-start items-start min-w-[400px] gap-16">
              {features.slice(2, 4).map((feature, index) => (
                <div key={index} className={`${featureItemClass} min-w-[300px] mt-8`}>
                  <div className="w-12 h-12 relative overflow-hidden">{feature.icon}</div>
                  <div className="text-black text-2xl md:text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                    {feature.heading}
                  </div>
                  <div className="text-black text-base font-normal font-['Roboto'] leading-normal">
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Show AuthPopup modal based on showPopup state */}
        {showPopup && <AuthPopup type={showPopup} onClose={() => setShowPopup(null)} />}
      </div>
    );
  };
  

export default Features;
