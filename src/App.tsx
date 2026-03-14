import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Books from "./pages/Books";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import WorkWithMe from "./pages/WorkWithMe";
import Podcast from "./pages/Podcast";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Media from "./pages/Media";
import Newsletter from "./pages/Newsletter";
import Publishing from "./pages/Publishing";
import Philanthropy from "./pages/Philanthropy";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/books" element={<Books />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/events" element={<Events />} />
              <Route path="/work-with-me" element={<WorkWithMe />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/media" element={<Media />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/publishing" element={<Publishing />} />
              <Route path="/philanthropy" element={<Philanthropy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
