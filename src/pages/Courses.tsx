import { motion } from "framer-motion";
import { GraduationCap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const courses = [
  { title: "Leadership in Education", desc: "Develop your leadership capacity with practical frameworks and case studies.", price: "$149" },
  { title: "Advocacy & Community Impact", desc: "Learn to create meaningful community change through evidence-based strategies.", price: "$129" },
  { title: "Research Methods for Educators", desc: "Master qualitative and quantitative research approaches in education.", price: "$179" },
];

const Courses = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Courses</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Enroll in transformative courses designed by Dr. Lundy. Register and login to purchase.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {courses.map((course, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow">
              <GraduationCap className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-heading text-xl text-primary mb-2">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{course.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl text-secondary">{course.price}</span>
                <Button variant="secondary" size="sm"><ShoppingCart className="w-4 h-4" /> Enroll</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Courses;
