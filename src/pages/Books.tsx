import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, FileText, Headphones, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
  if (format === "physical" || format === "paperback" || format === "hardcover") {
    return { label: "Physical Book", icon: BookOpen, color: "bg-amber-100 text-amber-800" };
  }
  return null;
};

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
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
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book", book_format: book.book_format });
    toast({ title: `"${book.title}" added to cart!` });
  };

  const handleOrderNow = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book", book_format: book.book_format });
    setCheckoutOpen(true);
  };

  const filteredBooks = books.filter((book) => {
    if (selectedFormat === "all") return true;
    if (selectedFormat === "physical") {
      return book.book_format === "physical" || book.book_format === "paperback" || book.book_format === "hardcover";
    }
    if (selectedFormat === "pdf") return book.book_format === "pdf";
    if (selectedFormat === "audio") return book.book_format === "audio";
    if (selectedFormat === "others") {
      const f = book.book_format;
      return f !== "pdf" && f !== "audio" && f !== "physical" && f !== "paperback" && f !== "hardcover";
    }
    return true;
  });

  return (
    <Layout>
      <section className="py-16 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Books</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Explore Dr. Lundy's published works on psychology, education, and multicultural perspectives.</motion.p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Category/Format Filter Tabs above Book Cards */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            custom={1}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {[
              { id: "all", label: "All Books" },
              { id: "physical", label: "Physical Books" },
              { id: "pdf", label: "PDF Books" },
              { id: "audio", label: "Audiobooks" },
              { id: "others", label: "Others" }
            ].map((tab) => {
              const active = selectedFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormat(tab.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm border",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-md -translate-y-0.5"
                      : "bg-card border-border/80 text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </motion.div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading books...</p>
          ) : filteredBooks.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No books found in this category.</p>
          ) : (
            /* 4 column grid on large screens to keep cards compact and elegant */
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, i) => {
                  const badge = formatBadge(book.book_format);
                  return (
                    <motion.div
                      layout
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-border/60 flex flex-col h-full"
                    >
                      {/* aspect-[2/3] matches standard book cover aspect ratio perfectly */}
                      <div className="aspect-[2/3] w-full overflow-hidden relative border-b bg-muted/5">
                        <img 
                          src={book.image_url || bookPlaceholder} 
                          alt={book.title} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2 flex flex-wrap gap-1 z-10">
                          {book.category && (
                            <span className="bg-secondary/95 text-secondary-foreground text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">{book.category}</span>
                          )}
                          {badge && (
                            <span className={`${badge.color} text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5`}>
                              <badge.icon className="w-2.5 h-2.5" /> {badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-heading text-sm sm:text-base font-semibold text-primary mb-1 line-clamp-2 leading-snug group-hover:text-secondary transition-colors">{book.title}</h3>
                          <p className="text-muted-foreground text-[11px] sm:text-xs line-clamp-2 leading-relaxed">{book.description}</p>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground font-medium">Price</span>
                            <span className="font-heading text-sm sm:text-base text-secondary font-bold">${book.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-dashed border-border/60">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-[11px] h-8 px-1" 
                              onClick={() => handleAdd(book)}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" /> Add
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1 text-[11px] h-8 px-1 font-semibold" 
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
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </Layout>
  );
};

export default Books;
