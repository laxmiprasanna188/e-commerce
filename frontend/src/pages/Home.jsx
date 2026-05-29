import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />

      <div className="pt-20">
        <Hero />
        <Features/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;