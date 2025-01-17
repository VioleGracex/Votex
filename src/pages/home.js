"use client";
import React, { useState, useEffect } from "react";
import Features from './HomeSections/Features'
import AOS from "aos";
import "aos/dist/aos.css";
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
      </section>
    </div>
  )
}

export default Home