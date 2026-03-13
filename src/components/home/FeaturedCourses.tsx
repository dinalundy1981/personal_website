import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import bookImg from "@/assets/book-placeholder.jpg";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, description, price, image_url")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(2);
      if (data) setCourses(data);
    };
    fetch();
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Courses</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Enroll in transformative courses designed by Dr. Lundy.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="bg-card rounded-xl overflow-hidden border shadow-md hover:shadow-lg transition-shadow group flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={course.image_url || bookImg} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-xl text-primary mb-2">{course.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-secondary">${course.price.toFixed(2)}</span>
                  <Link to="/courses"><Button variant="secondary" size="sm">Enroll Now</Button></Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
