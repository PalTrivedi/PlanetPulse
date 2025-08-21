import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom"; // or "next/link" if you're using Next.js

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#f5eee6] to-[#fffdf8] border-t border-[#e0d7cc] py-3 z-50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[#5a3217] gap-4 md:gap-0">
        
        {/* Left - Copyright */}
        <p className="text-xs text-center md:text-left">
          © {new Date().getFullYear()} GeoAnalytiQ. All rights reserved.
        </p>

        {/* Middle - Social Icons */}
        <div className="flex space-x-4">
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:text-[#a85c2c] transition duration-300 text-lg">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:text-[#a85c2c] transition duration-300 text-lg">
            <FaLinkedin />
          </a>
          <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:text-[#a85c2c] transition duration-300 text-lg">
            <FaGithub />
          </a>
        </div>

        {/* Right - Policy Links */}
        <div className="flex space-x-3 text-xs">
          <Link to="/privacy-policy" className="hover:underline hover:text-[#a85c2c] transition duration-300" disabled>
            Privacy Policy
          </Link>
          <Link to="/faq" className="hover:underline hover:text-[#a85c2c] transition duration-300">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );  
}
