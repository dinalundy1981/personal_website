import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import bookPlaceholder from "@/assets/book-placeholder.jpg";

interface Book {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  book_format: string | null;
}

const formatBadge = (format: string | null) => {
  if (format === "pdf") return { label: "PDF", icon: FileText, color: "bg-red-100 text-red-700" };
  if (format === "audio") return { label: "Audiobook", icon: Headphones, color: "bg-blue-100 text-blue-700" };
  return null;
};

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("books")
        .select("id, title, description, price, image_url, category, book_format")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (data) setBooks(data as Book[]);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleAdd = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    toast({ title: `"${book.title}" added to cart!` });
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Books</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Explore Dr. Lundy's published works on psychology, education, and multicultural perspectives.</motion.p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No books available yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, i) => {
                const badge = formatBadge(book.book_format);
                return (
                  <motion.div key={book.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                    className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border flex flex-row h-40 sm:h-44 w-full">
                    <div className="w-28 sm:w-32 h-full flex-shrink-0 overflow-hidden relative border-r">
                      <img 
                        src={book.image_url || bookPlaceholder} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0 h-full">
                      <div>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {book.category && (
                            <span className="bg-secondary/15 text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full">{book.category}</span>
                          )}
                          {badge && (
                            <span className={`${badge.color} text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5`}>
                              <badge.icon className="w-2.5 h-2.5" /> {badge.label}
                            </span>
                          )}
                        </div>
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Books;
