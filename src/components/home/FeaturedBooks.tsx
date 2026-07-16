import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import bookImg from "@/assets/book-placeholder.jpg";

interface Book {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("books")
        .select("id, title, description, price, image_url")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setBooks(data);
    };
    fetch();
  }, []);

  if (books.length === 0) return null;

  const handleAdd = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    toast({ title: `"${book.title}" added to cart!` });
  };

  return (
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Books</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore Dr. Lundy's published works on education, advocacy, and personal growth.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <motion.div key={book.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="bg-background rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border flex flex-row h-40 sm:h-44 w-full">
              <div className="w-28 sm:w-32 h-full flex-shrink-0 overflow-hidden relative border-r">
                <img 
                  src={book.image_url || bookImg} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0 h-full">
                <div>
                  <h3 className="font-heading text-base sm:text-lg text-primary mb-1 line-clamp-2 leading-snug">{book.title}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{book.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-border">
                  <span className="font-heading text-lg sm:text-xl text-secondary">${book.price.toFixed(2)}</span>
                  <Button variant="secondary" size="sm" className="h-8 px-2 sm:px-3 text-xs" onClick={() => handleAdd(book)}>
                    <ShoppingCart className="w-3.5 h-3.5" /> 
                    <span className="hidden xs:inline ml-1">Add to Cart</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/books"><Button variant="default" size="lg">View All Books <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
