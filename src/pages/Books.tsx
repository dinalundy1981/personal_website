import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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

  const handleOrderNow = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    setCheckoutOpen(true);
  };

  return (
    <Layout>
      <section className="py-16 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Books</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Explore Dr. Lundy's published works on psychology, education, and multicultural perspectives.</motion.p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No books available yet. Check back soon!</p>
          ) : (
            /* 4 column grid on large screens to keep cards compact and elegant */
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book, i) => {
                const badge = formatBadge(book.book_format);
                return (
                  <motion.div key={book.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                    className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border flex flex-col h-full">
                    
                    {/* aspect-[2/3] matches standard book cover aspect ratio perfectly */}
                    <div className="aspect-[2/3] w-full overflow-hidden relative border-b bg-muted/5">
                      <img 
                        src={book.image_url || bookPlaceholder} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
                        {book.category && (
                          <span className="bg-secondary text-secondary-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">{book.category}</span>
                        )}
                        {badge && (
                          <span className={`${badge.color} text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1`}>
                            <badge.icon className="w-3 h-3" /> {badge.label}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-heading text-base sm:text-lg text-primary mb-1.5 line-clamp-2 leading-snug group-hover:text-secondary transition-colors">{book.title}</h3>
                        <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{book.description}</p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">Price</span>
                          <span className="font-heading text-lg sm:text-xl text-secondary">${book.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-3 pt-2 border-t border-dashed border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs px-1" 
                            onClick={() => handleAdd(book)}
                          >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1 text-xs px-1 font-semibold" 
                            onClick={() => handleOrderNow(book)}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </Layout>
  );
};

export default Books;
