import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Calendar, Mic, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import profileImg from "@/assets/profile-placeholder.jpg";
import bookImg from "@/assets/book-placeholder.jpg";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import WorkWithMeCTA from "@/components/home/WorkWithMeCTA";
import PodcastPreview from "@/components/home/PodcastPreview";
import NewsletterCTA from "@/components/home/NewsletterCTA";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedBooks />
      <FeaturedCourses />
      <UpcomingEvents />
      <WorkWithMeCTA />
      <PodcastPreview />
      <NewsletterCTA />
    </Layout>
  );
};

export default Index;
