import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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

  const handleOrderNow = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: book.image_url, item_type: "book" });
    setCheckoutOpen(true);
  };

  return (
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Books</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore Dr. Lundy's published works on education, advocacy, and personal growth.</p>
        </motion.div>
        
        {/* max-w-4xl centers and makes the 3 cards compact and small on desktop */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {books.map((book, i) => (
            <motion.div key={book.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
              className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border flex flex-col h-full">
              
              {/* aspect-[2/3] fits standard book covers perfectly with NO cropping or borders */}
              <div className="aspect-[2/3] w-full overflow-hidden relative border-b bg-muted/5">
                <img 
                  src={book.image_url || bookImg} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-heading text-base sm:text-lg text-primary mb-1 line-clamp-2 leading-snug group-hover:text-secondary transition-colors">{book.title}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{book.description}</p>
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
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/books">
            <Button variant="default" size="lg">
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
