import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Calendar, Mic, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile-placeholder.jpg";
import bookImg from "@/assets/book-placeholder.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Academic background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <p className="text-warm text-sm font-semibold tracking-widest uppercase mb-4">
                Scholar · Author · Speaker
              </p>
              <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
                Dr. Dina Lundy
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-lg mb-8 leading-relaxed">
                Empowering communities through education, research, and advocacy. 
                Discover books, courses, and coaching to transform your journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/books">
                  <Button variant="hero" size="lg">
                    <BookOpen className="w-5 h-5" /> View Books
                  </Button>
                </Link>
                <Link to="/work-with-me">
                  <Button variant="heroOutline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Work With Me
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden lg:flex justify-center"
            >
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-warm shadow-2xl">
                <img src={profileImg} alt="Dr. Dina Lundy" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personal Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="lg:hidden flex justify-center"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-warm shadow-xl">
                <img src={profileImg} alt="Dr. Dina Lundy" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <h2 className="font-heading text-3xl md:text-4xl text-primary mb-6">
                About Dr. Dina Lundy
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Dr. Dina Lundy is a distinguished scholar, published author, and passionate advocate 
                for education equity. With a rich academic background and years of impactful research, 
                she has dedicated her career to uplifting marginalized communities.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Her work spans foster youth advocacy, diversity initiatives, and personal development 
                coaching, making her a sought-after speaker and thought leader in academia.
              </p>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Books</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Explore Dr. Lundy's published works on education, advocacy, and personal growth.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Education & Equity", desc: "A deep dive into creating equitable educational systems for all." },
              { title: "Foster Youth Voices", desc: "Amplifying the stories of foster youth through research and advocacy." },
              { title: "Rise & Transform", desc: "A personal development guide for leaders in education." },
            ].map((book, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="h-64 overflow-hidden">
                  <img src={bookImg} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl text-primary mb-2">{book.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{book.desc}</p>
                  <Link to="/books">
                    <Button variant="secondary" size="sm">View Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/books"><Button variant="default" size="lg">View All Books <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Courses</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Enroll in transformative courses designed by Dr. Lundy.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: GraduationCap, title: "Leadership in Education", price: "$149" },
              { icon: Heart, title: "Advocacy & Community Impact", price: "$129" },
            ].map((course, i) => (
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

      {/* Upcoming Events */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Join Dr. Lundy at conferences, workshops, and speaking engagements.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { date: "Mar 25, 2026", title: "Education Equity Summit", location: "Los Angeles, CA" },
              { date: "Apr 10, 2026", title: "Youth Advocacy Workshop", location: "Chicago, IL" },
              { date: "May 5, 2026", title: "Leadership Conference", location: "New York, NY" },
            ].map((event, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-secondary text-sm font-semibold mb-3">
                  <Calendar className="w-4 h-4" /> {event.date}
                </div>
                <h3 className="font-heading text-lg text-primary mb-1">{event.title}</h3>
                <p className="text-muted-foreground text-sm">{event.location}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/events"><Button variant="default" size="lg">View All Events</Button></Link>
          </div>
        </div>
      </section>

      {/* Work With Me CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">Work With Me</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
              Ready to transform your leadership, academic career, or personal journey? 
              Schedule a coaching consultation with Dr. Lundy today.
            </p>
            <Link to="/work-with-me">
              <Button variant="hero" size="lg">
                Schedule Consultation <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Podcast Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Latest Podcast</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Listen to Dr. Lundy's insights on education, leadership, and advocacy.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 border shadow-md flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-warm flex items-center justify-center shrink-0">
              <Mic className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-heading text-xl text-primary mb-2">The Education Equity Podcast</h3>
              <p className="text-muted-foreground text-sm mb-4">Conversations about creating systemic change in education and uplifting underserved communities.</p>
              <Link to="/podcast"><Button variant="secondary" size="sm">Listen Now</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-warm/40">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="font-heading text-3xl text-primary mb-4">Stay Connected</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Read the latest newsletters and stay updated on Dr. Lundy's work.
            </p>
            <Link to="/newsletter"><Button variant="default" size="lg">View Newsletters</Button></Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
