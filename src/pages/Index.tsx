import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import WorkWithMeCTA from "@/components/home/WorkWithMeCTA";
import PodcastPreview from "@/components/home/PodcastPreview";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import { useSiteImages } from "@/hooks/useSiteImages";

const Index = () => {
  const { images } = useSiteImages();

  return (
    <Layout>
      <HeroSection heroImage={images["hero"]} />
      <AboutPreview images={images} />
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
