import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
import bookImg from "@/assets/book-placeholder.jpg";

interface Book {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category?: string | null;
}

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("books")
        .select("id, title, description, price, image_url, category")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setBooks(data as Book[]);
    };
    fetch();
  }, []);

  if (books.length === 0) return null;

  const activeBook = books[activeIndex] || books[0];

  const handleAdd = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    toast({ title: `"${book.title}" added to cart!` });
  };

  const handleOrderNow = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    setCheckoutOpen(true);
  };

  return (
    <section className="py-20 bg-warm/30 relative overflow-hidden">
      {/* Subtle decorative circles for a premium publishing press feel */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-5xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Book Collection
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Books</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore Dr. Lundy's highly acclaimed publications on education equity, youth advocacy, and behavioral science.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column — Spotlight Interactive Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBook.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row gap-6 items-center sm:items-stretch h-full"
              >
                {/* Book Cover (Full Cover, aspect-[2/3], shadow, no side margins) */}
                <div className="w-40 sm:w-48 aspect-[2/3] overflow-hidden rounded-xl shadow-2xl flex-shrink-0 relative bg-muted/5 group border">
                  <img 
                    src={activeBook.image_url || bookImg} 
                    alt={activeBook.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                  <div>
                    <div className="flex justify-center sm:justify-start gap-1.5 mb-2.5">
                      {activeBook.category && (
                        <span className="bg-secondary/15 text-secondary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {activeBook.category}
                        </span>
                      )}
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5" /> Featured
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-xl sm:text-2xl text-primary leading-tight mb-3">
                      {activeBook.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 line-clamp-4">
                      {activeBook.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1 mb-4">
                      <span className="text-xs text-muted-foreground font-semibold uppercase">Price:</span>
                      <span className="font-heading text-2xl text-secondary ml-1">${activeBook.price.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-3 justify-center sm:justify-start pt-3 border-t border-dashed border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs px-4 py-4 h-auto" 
                        onClick={() => handleAdd(activeBook)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1.5" /> Add to Cart
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="text-xs px-5 py-4 h-auto font-semibold" 
                        onClick={() => handleOrderNow(activeBook)}
                      >
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column — Selection List Stack */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
            {books.map((book, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={book.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={index + 1}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                    isActive 
                      ? "bg-card border-secondary/60 shadow-md ring-1 ring-secondary/20" 
                      : "bg-card/40 hover:bg-card border-border/80 hover:border-border hover:shadow-sm"
                  )}
                >
                  {/* Left accent strip for active item */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                  )}

                  {/* Thumbnail Cover (aspect-[2/3], full-bleed cover) */}
                  <div className="w-12 sm:w-14 aspect-[2/3] overflow-hidden rounded shadow-md flex-shrink-0 relative border bg-muted/5">
                    <img 
                      src={book.image_url || bookImg} 
                      alt={book.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Quick Details */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-heading text-sm sm:text-base leading-snug truncate",
                      isActive ? "text-secondary" : "text-primary"
                    )}>
                      {book.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[9px] font-semibold text-muted-foreground tracking-wide capitalize bg-muted px-1.5 py-0.5 rounded">
                        {book.category || "Book"}
                      </span>
                      <span className="text-xs font-semibold text-foreground/80">${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/books">
            <Button variant="default" size="lg" className="shadow-md">
              View All Books <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </section>
  );
};

export default FeaturedBooks;
