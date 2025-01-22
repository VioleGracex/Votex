import React from 'react';
import Social from './Social';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="#" className="flex items-center">
              {/* <img src="/assets/Images/navbar/logo.png" className="h-8 me-3" alt="Logo" /> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Votex</span>
            </a>
          </div>
          {/* Adjust grid layout for md screens */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 md:ml-8">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Ресурсы</h2>
              <ul className="text-black dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Сайт</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Блог</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Следите за нами</h2>
              <ul className="text-black dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">ВКонтакте</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Instagram</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Юридическая информация</h2>
              <ul className="text-black dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Политика конфиденциальности</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Условия использования</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center dark:text-gray-400">© 2025 Ваша компания. Все права защищены.</span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Social/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
