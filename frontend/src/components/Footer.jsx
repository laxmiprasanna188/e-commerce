// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between gap-10">
        
        {/* Brand Info */}
        <div className="mb-8 md:mb-0">
          <Link to="/">
            <img
              src="/Ekart.png"
              alt="eKart"
              className="w-32"
            />
          </Link>

          <p className="mt-4 text-sm">
            Powering Your World with the Best in Electronics.
          </p>

          <p className="mt-2 text-sm">
            123 Electronics St, Style City, NY 10001
          </p>

          <p className="text-sm">
            Email: support@eKart.com
          </p>

          <p className="text-sm">
            Phone: (123) 456-7890
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-xl">
            <a href="/">
              <FaFacebook className="hover:text-blue-500 duration-300" />
            </a>

            <a href="/">
              <FaInstagram className="hover:text-pink-500 duration-300" />
            </a>

            <a href="/">
              <FaPinterest className="hover:text-red-500 duration-300" />
            </a>

            <a href="/">
              <FaTwitterSquare className="hover:text-sky-500 duration-300" />
            </a>
          </div>
        </div>

        {/* Customer Service */}
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-semibold mb-4">
            Customer Service
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/">Contact Us</Link>
            </li>

            <li>
              <Link to="/">Shipping & Returns</Link>
            </li>

            <li>
              <Link to="/">FAQs</Link>
            </li>

            <li>
              <Link to="/">Order Tracking</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/">Shop</Link>
            </li>

            <li>
              <Link to="/">About</Link>
            </li>

            <li>
              <Link to="/">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold">
            Stay in the Loop
          </h3>

          <p className="mt-2 text-sm">
            Subscribe to get special offers, free giveaways, and more.
          </p>

          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md bg-white text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <button
              type="submit"
              className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700 duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-pink-500 font-semibold">
            eKart
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;