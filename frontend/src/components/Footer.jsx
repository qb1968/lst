import { Link } from "react-router-dom";

// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-sm text-center py-6 border-t border-gray-700">
      © {new Date().getFullYear()} Liberty Showcase Theater. All rights
      reserved. Created by <Link to="https://allwebcon.com" target="_blank" className="underline">Allison Web Consultants</Link>
    </footer>
  );
}
