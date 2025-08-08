import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Calendar from "./pages/Calendar";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import Faqs from "./pages/Faqs";
import SeatingChart from "./pages/SeatingChart";
import Gallery from "./pages/Gallery";
import Alliance from "./pages/Alliance";
import MassEmailAds from "./components/MassEmailAds";
import Sponsors from "./pages/Sponsors";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          {/* Logo or Brand */}
         

          {/* Hamburger Icon - Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Nav - Desktop */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/faqs" className="hover:underline">
              FAQs/POLICIES
            </Link>
            <Link to="/seating-chart" className="hover:underline">
              Seating Chart
            </Link>
            <Link to="/gallery" className="hover:underline">
              Gallery
            </Link>
            <Link to="/alliance" className="hover:underline">
              Alliance Center
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/calendar" className="hover:underline">
              Calendar
            </Link>
            <Link to="/sponsors" className="hover:underline">
              Sponsors
            </Link>
            {/* <Link to="/admin" className="hover:underline">Admin</Link> */}
          </nav>
        </div>

        {/* Nav - Mobile Dropdown */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 text-lg text-center">
            <Link to="/" onClick={closeMenu} className="hover:underline">
              Home
            </Link>
            <Link to="/about" onClick={closeMenu} className="hover:underline">
              About
            </Link>
            <Link to="/faqs" onClick={closeMenu} className="hover:underline">
              FAQs/POLICIES
            </Link>
            <Link
              to="/seating-chart"
              onClick={closeMenu}
              className="hover:underline"
            >
              Seating Chart
            </Link>
            <Link to="/gallery" onClick={closeMenu} className="hover:underline">
              Gallery
            </Link>
            <Link
              to="/alliance"
              onClick={closeMenu}
              className="hover:underline"
            >
              Alliance Center
            </Link>
            <Link to="/contact" onClick={closeMenu} className="hover:underline">
              Contact
            </Link>
            <Link
              to="/calendar"
              onClick={closeMenu}
              className="hover:underline"
            >
              Calendar
            </Link>
            <Link
              to="/sponsors"
              onClick={closeMenu}
              className="hover:underline"
            >
              Sponsors
            </Link>
          </nav>
        )}
      </header>

      {/* Page Content */}
      <div className="min-h-screen flex flex-col bg-black text-white textarea-bg-white ">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/seating-chart" element={<SeatingChart />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/alliance" element={<Alliance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/mass-email" element={<MassEmailAds />} />
            <Route path="/sponsors" element={<Sponsors/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
