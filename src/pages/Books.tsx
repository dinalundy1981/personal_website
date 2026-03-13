import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import bookLatinx from "@/assets/book-latinx.png";
import bookMulticultural from "@/assets/book-multicultural.jpg";
import bookHumanDev from "@/assets/book-human-dev.jpg";
import bookPsychological from "@/assets/book-psychological.jpg";
import bookDeveloping from "@/assets/book-developing.jpg";

const books = [
  {
    title: "The Psychological Perspectives of LATINX and Chicano Populations",
    desc: "Discusses the chattel slavery implications of the Bracero Program. Forward by Rosalba Moreno, a Chicana and community activist from the Salinas Valley.",
    price: "$24.99",
    image: bookLatinx,
    badge: "New Release",
  },
  {
    title: "Developing Understanding",
    desc: "Co-authored with Su L. Boatright PhD. A comprehensive exploration of psychological concepts and their real-world applications.",
    price: "$19.99",
    image: bookDeveloping,
  },
  {
    title: "Broadening Our Multicultural Lens",
    desc: "An essential text for understanding multicultural perspectives in psychology and education.",
    price: "$22.99",
    image: bookMulticultural,
  },
  {
    title: "Human Development for the Real World: Applying Research to Everyday Life",
    desc: "Bridging the gap between academic research and practical everyday application of psychological concepts.",
    price: "$27.99",
    image: bookHumanDev,
    badge: "Fall 2025",
  },
  {
    title: "Psychological Concepts",
    desc: "A foundational text exploring key psychological concepts for students and practitioners.",
    price: "$21.99",
    image: bookPsychological,
  },
];

const Books = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Books</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Explore Dr. Lundy's published works on psychology, education, and multicultural perspectives.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group border flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {book.badge && (
                  <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">{book.badge}</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-heading text-lg text-primary mb-2">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{book.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-heading text-xl text-secondary">{book.price}</span>
                  <Button variant="secondary" size="sm"><ShoppingCart className="w-4 h-4 mr-1" /> Buy</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Books;
