import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import bookImg from "@/assets/book-placeholder.jpg";

const courses = [
  { title: "Leadership in Education", price: "$149", desc: "Comprehensive course with expert guidance and practical exercises.", image: bookImg },
  { title: "Advocacy & Community Impact", price: "$129", desc: "Learn strategies to create lasting change in underserved communities.", image: bookImg },
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
            className="bg-card rounded-xl overflow-hidden border shadow-md hover:shadow-lg transition-shadow group flex flex-col">
            <div className="h-48 overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-heading text-xl text-primary mb-2">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 flex-1">{course.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl text-secondary">{course.price}</span>
                <Link to="/courses"><Button variant="secondary" size="sm">Enroll Now</Button></Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCourses;
