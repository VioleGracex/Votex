"use client";
import React, { useState, useEffect } from "react";
import Features from './HomeSections/Features'
import AOS from "aos";
import "aos/dist/aos.css";
import AuthForm from "../pages/AuthForm";
const Home = () => {
  const [isPlay, setIsPlay] = useState(false);

  const togglePlay = () => {
    setIsPlay(!isPlay);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <div>
      <section id="Features">
        <Features togglePlay={togglePlay} />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <AuthForm />
        </div>
      </section>
    </div>
  )
}

export default Home