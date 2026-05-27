import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Gallery";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Wishes from "./pages/Wishes";
import Friendship from "./pages/Friendship";
import ProtectedRoute from "./components/ProtectedRoute";
import BirthdayPopup from "./components/BirthdayPopup";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-dark text-white">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/wishes" element={<Wishes />} />
            <Route
              path="/friendship"
              element={
                <ProtectedRoute password="toretto">
                  <Friendship />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <BirthdayPopup />
      </div>
    </BrowserRouter>
  );
}

export default App;
