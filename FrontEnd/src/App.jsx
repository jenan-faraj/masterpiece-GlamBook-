import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/LogIn";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import Categories from "./Pages/categories";
import SalonRegistrationForm from "./Pages/RegisterSalon";
import SalonDetails from "./Pages/salonDetails";
import Book from "./Pages/SalonBook";
import Payment from "./Pages/Payment";
import AboutPage from "./Pages/About";
import ContactUs from "./Pages/Contact";
import UserProfile from "./Pages/userProfile";
import AdminPanel from "./components/Dashboard/AdminSidebar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const AppContent = () => {
  const location = useLocation();

  const shouldHideNavbar = () => {
    return (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname.startsWith("/admin") // هذا سيتحقق من كل المسارات التي تبدأ بـ /admin
    );
  };

  const shouldHideFooter = () => {
    return (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname.startsWith("/admin")
    );
  };

  return (
    <>
      {!shouldHideNavbar() && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/salonDetails/:id" element={<SalonDetails />} />
        <Route path="/RegisterSalon" element={<SalonRegistrationForm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/aboutUs" element={<AboutPage />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/userProfile/*" element={<UserProfile />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideFooter() && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
