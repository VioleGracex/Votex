"use client";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons from react-icons

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light"); // Default theme set to "light"
  const [rotated, setRotated] = useState(false); // State for rotation
  const element = document.documentElement;

  useEffect(() => {
    // Check the system's preferred theme and apply it on the initial load
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(preferredTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  }, [theme]);

  // Handle click and trigger rotation
  const handleIconClick = () => {
    setRotated(true);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setTimeout(() => setRotated(false), 300); // Reset rotation after animation
  };

  return (
    <div className="group relative">
      {/* Light mode icon */}
      <FaSun
        onClick={handleIconClick}
        className={`w-8 h-8 cursor-pointer text-yellow-500 transition-all duration-300 absolute right-0 z-10 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        } ${rotated ? "rotate-180" : ""} ${rotated ? "" : "hover:rotate-[-30deg]"}`} // Disable hover effect after click
      />
      {/* Dark mode icon */}
      <FaMoon
        onClick={handleIconClick}
        className={`w-8 h-8 cursor-pointer text-white-800 transition-all duration-300 ${
          theme === "light" ? "opacity-0" : "opacity-100"
        } ${rotated ? "rotate-180" : ""} ${rotated ? "" : "group-hover:rotate-[-30deg]"}`} // Disable hover effect after click
      />
    </div>
  );
};

export default ThemeToggle;
