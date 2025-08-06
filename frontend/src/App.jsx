import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
      <header className="bg-black text-white p-4 flex justify-center items-center">
        <nav className="space-x-12 text-lg">
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
          {/* <Link to="/admin" className="hover:underline">
            Admin
          </Link> */}
        </nav>
      </header>

      <div className="min-h-screen flex flex-col bg-black text-white">
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
