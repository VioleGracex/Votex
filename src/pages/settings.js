import React, { useState } from 'react';
import { FaLock, FaPalette, FaFileAlt, FaFont, FaHome, FaTachometerAlt } from 'react-icons/fa';
import "../app/globals.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const renderContent = () => {
    switch(activeTab) {
      case 'privacy':
        return <PrivacySettings />;
      case 'theme':
        return <ThemeSettings />;
      case 'pages':
        return <ManagePages />;
      case 'fonts':
        return <FontSettings />;
      default:
        return <PrivacySettings />;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <header className="flex justify-between items-center py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Настройки</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            title="Домой"
          >
            <FaHome size={20} />
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            title="Панель"
          >
            <FaTachometerAlt size={20} />
          </button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row mt-4">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-4 bg-white shadow-md rounded-lg mt-4 md:mt-0 md:ml-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full md:w-1/4 p-4 bg-gray-100 rounded-lg">
      <ul className="space-y-2">
        <li>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('privacy')}
          >
            <FaLock />
            Конфиденциальность
          </button>
        </li>
        <li>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'theme' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('theme')}
          >
            <FaPalette />
            Тема
          </button>
        </li>
        <li>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'pages' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('pages')}
          >
            <FaFileAlt />
            Управление страницами
          </button>
        </li>
        <li>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'fonts' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('fonts')}
          >
            <FaFont />
            Шрифты
          </button>
        </li>
      </ul>
    </div>
  );
};

const PrivacySettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Настройки конфиденциальности</h2>
    {/* Добавьте содержание настроек конфиденциальности здесь */}
  </div>
);

const ThemeSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Настройки темы</h2>
    {/* Добавьте содержание настроек темы здесь */}
  </div>
);

const ManagePages = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Управление страницами</h2>
    {/* Добавьте содержание управления страницами здесь */}
  </div>
);

const FontSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Настройки шрифтов</h2>
    {/* Добавьте содержание настроек шрифтов здесь */}
  </div>
);

export default Settings;