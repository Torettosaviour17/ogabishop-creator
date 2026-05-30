import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Wishes from "./pages/Wishes";
import Friendship from "./pages/Friendship";
import ProtectedRoute from "./components/ProtectedRoute";
import BirthdayPopup from "./components/BirthdayPopup";
import Gallery from "./pages/Gallery";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-dark text-white">
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Home is public */}
            <Route path="/" element={<Home />} />

            {/* All other routes require password "jesus" */}
            <Route path="/about" element={<About />} />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute password="jesus">
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/events"
              element={
                <ProtectedRoute password="jesus">
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishes"
              element={
                <ProtectedRoute password="jesus">
                  <Wishes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friendship"
              element={
                <ProtectedRoute password="jesus">
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
