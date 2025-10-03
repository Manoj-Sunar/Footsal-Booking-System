import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Book Now", path: "/book" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact" },
];

const contactInfo = [
  { icon: MapPin, text: "Kathmandu, Nepal" },
  { icon: Phone, text: "+977 980-1234567" },
  { icon: Mail, text: "support@futsalarena.com" },
];

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white mt-10">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div className="flex items-start flex-col  p-1">
          <h2 className="text-2xl font-bold mb-3">FutsalArena</h2>
          <p className="text-sm text-gray-200 text-justify">
            Book your futsal slots easily and enjoy a seamless experience. 
            The best futsal booking system for players, teams, and tournaments.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-start flex-col p-1">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 flex items-start flex-col">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="hover:text-yellow-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex items-start flex-col p-1">
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-200">
            {contactInfo.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <item.icon size={18} /> {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */} 
        <div className="flex items-start flex-col p-1">
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="hover:text-yellow-300">
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-900 text-center py-4 text-sm text-gray-300">
        © {new Date().getFullYear()} FutsalArena. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
