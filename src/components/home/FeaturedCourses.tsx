import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

const courses = [
  { icon: GraduationCap, title: "Leadership in Education", price: "$149" },
  { icon: Heart, title: "Advocacy & Community Impact", price: "$129" },
];

const FeaturedCourses = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Courses</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Enroll in transformative courses designed by Dr. Lundy.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {courses.map((course, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            className="bg-card rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow">
            <course.icon className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-heading text-xl text-primary mb-2">{course.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">Comprehensive course with expert guidance and practical exercises.</p>
            <div className="flex items-center justify-between">
              <span className="font-heading text-2xl text-secondary">{course.price}</span>
              <Link to="/courses"><Button variant="secondary" size="sm">Enroll Now</Button></Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCourses;
