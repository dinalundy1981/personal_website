import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import bookPlaceholder from "@/assets/book-placeholder.jpg";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
}

const card3D = {
  hidden: { opacity: 0, y: 50, rotateX: 12, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, description, price, image_url, category")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleEnroll = (course: Course) => {
    addToCart({ id: course.id, title: course.title, price: course.price, image_url: course.image_url, item_type: "course" });
    toast({ title: `"${course.title}" added to cart!` });
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="font-heading text-4xl md:text-5xl text-primary mb-4"
          >
            Courses
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Enroll in transformative courses designed by Dr. Lundy. Register and login to purchase.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No courses available yet. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={card3D}
                  custom={i}
                  whileHover={{
                    rotateX: -3,
                    rotateY: 4,
                    scale: 1.03,
                    boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.15)",
                    transition: { duration: 0.3 },
                  }}
                  className="bg-card rounded-xl overflow-hidden shadow-md border flex flex-col"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={course.image_url || bookPlaceholder}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {course.category && (
                      <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {course.category}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <GraduationCap className="absolute bottom-3 left-3 w-8 h-8 text-white/80" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-lg text-primary mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">{course.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-heading text-xl text-secondary">${course.price.toFixed(2)}</span>
                      <Button variant="secondary" size="sm" onClick={() => handleEnroll(course)}>
                        <ShoppingCart className="w-4 h-4 mr-1" /> Enroll
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
