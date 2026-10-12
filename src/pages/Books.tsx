import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, FileText, Headphones, BookOpen, Star, Info, Search, Filter, ArrowUpDown, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
import bookPlaceholder from "@/assets/book-placeholder.jpg";
import bookDeveloping from "@/assets/book-developing.jpg";
import bookHumanDev from "@/assets/book-human-dev.jpg";
import bookLatinx from "@/assets/book-latinx.png";
import bookMulticultural from "@/assets/book-multicultural.jpg";
import bookPsychological from "@/assets/book-psychological.jpg";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";

interface Book {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  book_format: string | null;
  rating: number | null;
  details: string | null;
}

const getBookCoverImage = (book: Book) => {
  if (book.image_url && !book.image_url.includes("placeholder")) {
    return book.image_url;
  }
  const titleLower = (book.title || "").toLowerCase();
  if (titleLower.includes("latinx") || titleLower.includes("chicano")) return bookLatinx;
  if (titleLower.includes("multicultural")) return bookMulticultural;
  if (titleLower.includes("human development") || titleLower.includes("lifespan")) return bookHumanDev;
  if (titleLower.includes("developmental")) return bookDeveloping;
  if (titleLower.includes("psychological concepts")) return bookPsychological;
  return bookPlaceholder;
};

const formatBadge = (format: string | null) => {
  if (format === "pdf") return { label: "PDF", icon: FileText, color: "bg-red-100 text-red-700" };
  if (format === "audio") return { label: "Audiobook", icon: Headphones, color: "bg-blue-100 text-blue-700" };
  if (format === "physical" || format === "paperback" || format === "hardcover") {
    return { label: "Physical Book", icon: BookOpen, color: "bg-amber-100 text-amber-800" };
  }
  return null;
};

const TOPIC_FILTERS = [
  { id: "all", label: "All Topics" },
  { id: "multicultural", label: "Multicultural & Social" },
  { id: "foster_care", label: "Foster Care & Youth" },
  { id: "developmental", label: "Human Development" },
  { id: "research", label: "Research Studies" },
];

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "title">("featured");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async (bookId: string) => {
    setLoadingReviews(true);
    const { data, error } = await supabase
      .from("book_reviews")
      .select("*, profiles(full_name)")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Could not fetch reviews. You may need to run the SQL migration for book_reviews.", error.message);
      setReviews([]);
    } else if (data) {
      setReviews(data);
    }
    setLoadingReviews(false);
  };

  useEffect(() => {
    if (selectedBook) {
      fetchReviews(selectedBook.id);
      setNewComment("");
      setNewRating(5);
    } else {
      setReviews([]);
    }
  }, [selectedBook]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login to leave a review.", variant: "destructive" });
      return;
    }
    if (!newComment.trim()) {
      toast({ title: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    setSubmittingReview(true);
    const { error } = await supabase.from("book_reviews").insert({
      book_id: selectedBook?.id,
      user_id: user.id,
      comment: newComment,
      rating: newRating,
    });

    if (error) {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted successfully!" });
      setNewComment("");
      setNewRating(5);
      if (selectedBook) fetchReviews(selectedBook.id);
    }
    setSubmittingReview(false);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      let { data, error } = await supabase
        .from("books")
        .select("id, title, description, price, image_url, category, book_format, rating, details")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error && error.message.includes("rating")) {
        const fallbackRes = await supabase
          .from("books")
          .select("id, title, description, price, image_url, category, book_format")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        console.error("Error fetching books:", error);
      }

      if (data) {
        setBooks(data.map((book: any) => ({
          ...book,
          rating: book.rating !== undefined ? book.rating : null,
          details: book.details !== undefined ? book.details : null
        })) as Book[]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleAdd = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: getBookCoverImage(book), item_type: "book", book_format: book.book_format });
    toast({ title: `"${book.title}" added to cart!` });
  };

  const handleOrderNow = (book: Book) => {
    addToCart({ id: book.id, title: book.title, price: book.price, image_url: getBookCoverImage(book), item_type: "book", book_format: book.book_format });
    setCheckoutOpen(true);
  };

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (book.title || "").toLowerCase().includes(q) ||
          (book.description || "").toLowerCase().includes(q) ||
          (book.category || "").toLowerCase().includes(q) ||
          (book.details || "").toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Topic Filter
      if (selectedTopic !== "all") {
        const titleAndCat = `${book.title} ${book.category} ${book.description}`.toLowerCase();
        if (selectedTopic === "multicultural" && !titleAndCat.includes("multicultural") && !titleAndCat.includes("latinx") && !titleAndCat.includes("chicano")) {
          return false;
        }
        if (selectedTopic === "foster_care" && !titleAndCat.includes("foster") && !titleAndCat.includes("youth") && !titleAndCat.includes("state care") && !titleAndCat.includes("own")) {
          return false;
        }
        if (selectedTopic === "developmental" && !titleAndCat.includes("development") && !titleAndCat.includes("lifespan") && !titleAndCat.includes("psychological concepts")) {
          return false;
        }
        if (selectedTopic === "research" && !titleAndCat.includes("research") && !titleAndCat.includes("study") && !titleAndCat.includes("trajectory") && !titleAndCat.includes("examination")) {
          return false;
        }
      }

      // 3. Format Filter
      if (selectedFormat === "physical") {
        return book.book_format === "physical" || book.book_format === "paperback" || book.book_format === "hardcover";
      }
      if (selectedFormat === "pdf") return book.book_format === "pdf";
      if (selectedFormat === "audio") return book.book_format === "audio";

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // Default order
    });
  }, [books, searchQuery, selectedTopic, selectedFormat, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedTopic !== "all" || selectedFormat !== "all" || sortBy !== "featured";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setSelectedFormat("all");
    setSortBy("featured");
  };

  return (
    <Layout>
      <SEO
        title="Books & Publications | Dr. Dina Lundy"
        description="Explore Dr. Dina Lundy's published textbooks and guides on multicultural psychology, human development, foster youth advocacy, and Black family structures."
        keywords="Dr Dina Lundy books, psychological perspectives of latinx, chicano studies, psychology textbooks, foster care guide"
      />

      {/* Hero Header */}
      <section className="py-14 sm:py-20 bg-warm/30 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Published Textbooks & Works
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-primary font-bold mb-4">
              Book Collection & Publications
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore Dr. Dina Lundy's acclaimed academic textbooks, developmental psychology volumes, and practical empowerment guides for system-involved youth and multicultural learners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organization, Search & Filters Bar */}
      <section className="py-8 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Top Row: Search + Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by title, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 py-2 bg-card rounded-full border-border/80 text-sm shadow-sm focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Format & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Format Dropdown */}
              <div className="flex items-center gap-1.5 bg-card border rounded-full px-3 py-1 shadow-sm text-xs">
                <span className="text-muted-foreground font-medium">Format:</span>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="bg-transparent font-semibold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="all">All Formats</option>
                  <option value="physical">Physical Books</option>
                  <option value="pdf">Digital PDFs</option>
                  <option value="audio">Audiobooks</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-card border rounded-full px-3 py-1 shadow-sm text-xs">
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7 text-destructive hover:bg-destructive/10">
                  <X className="w-3 h-3 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* Topic Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Topic:
            </span>
            {TOPIC_FILTERS.map((tab) => {
              const active = selectedTopic === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTopic(tab.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border/80 hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Result Counter */}
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing <strong>{filteredBooks.length}</strong> publication{filteredBooks.length === 1 ? "" : "s"}</span>
            {searchQuery && <span>Matching &ldquo;{searchQuery}&rdquo;</span>}
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading books...</p>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-dashed p-8 max-w-md mx-auto space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <h3 className="font-heading font-semibold text-primary text-lg">No books found</h3>
              <p className="text-xs text-muted-foreground">We couldn&apos;t find any books matching your current filters.</p>
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-xs">
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book) => {
                  const badge = formatBadge(book.book_format);
                  const coverImg = getBookCoverImage(book);

                  return (
                    <motion.div
                      layout
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/70 flex flex-col h-full"
                    >
                      {/* Book Cover Container with matching shadow & badging */}
                      <div
                        onClick={() => setSelectedBook(book)}
                        className="aspect-[2/3] w-full overflow-hidden relative border-b bg-muted/20 cursor-pointer"
                      >
                        <img
                          src={coverImg}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1 z-10">
                          {book.category && (
                            <span className="bg-secondary/95 text-secondary-foreground text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                              {book.category}
                            </span>
                          )}
                          {badge && (
                            <span className={`${badge.color} text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5`}>
                              <badge.icon className="w-2.5 h-2.5" /> {badge.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3
                            onClick={() => setSelectedBook(book)}
                            className="font-heading text-sm sm:text-base font-bold text-primary mb-1 line-clamp-2 leading-snug group-hover:text-secondary transition-colors cursor-pointer"
                          >
                            {book.title}
                          </h3>

                          <div className="flex items-center justify-between mt-1 mb-2">
                            {book.rating && (
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-semibold text-foreground/80">{Number(book.rating).toFixed(1)}</span>
                              </div>
                            )}
                            <button
                              onClick={() => setSelectedBook(book)}
                              className="text-[11px] text-secondary hover:underline font-semibold flex items-center gap-0.5 ml-auto"
                            >
                              <Info className="w-3 h-3" /> Details
                            </button>
                          </div>

                          <p className="text-muted-foreground text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                            {book.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed border-border/70">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] text-muted-foreground font-medium">Price</span>
                            <span className="font-heading text-base sm:text-lg text-secondary font-bold">
                              ${book.price.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8 px-2 font-medium"
                              onClick={() => handleAdd(book)}
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" /> Add
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 text-xs h-8 px-2 font-semibold"
                              onClick={() => handleOrderNow(book)}
                            >
                              Order
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

      {/* Checkout Dialog */}
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />

      {/* Book Details Modal */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto">
          {selectedBook && (
            <div>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-primary font-heading text-xl sm:text-2xl leading-snug">
                  {selectedBook.title}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
                {/* Book Image */}
                <div className="md:col-span-2 space-y-4">
                  <div className="aspect-[2/3] w-full rounded-xl overflow-hidden border shadow-md bg-muted/20 relative">
                    <img
                      src={getBookCoverImage(selectedBook)}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                      {selectedBook.category && (
                        <span className="bg-secondary/95 text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          {selectedBook.category}
                        </span>
                      )}
                      {formatBadge(selectedBook.book_format) && (
                        <span className={`${formatBadge(selectedBook.book_format)?.color} text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5`}>
                          {(() => {
                            const bBadge = formatBadge(selectedBook.book_format);
                            return bBadge && <><bBadge.icon className="w-3 h-3" /> {bBadge.label}</>;
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata & Description */}
                <div className="md:col-span-3 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <span className="text-xs text-muted-foreground font-medium">Price</span>
                        <p className="font-heading text-2xl text-secondary font-bold">${selectedBook.price.toFixed(2)}</p>
                      </div>
                      {selectedBook.rating && (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground font-medium block">Rating</span>
                          <div className="flex items-center gap-1 text-amber-500 justify-end mt-0.5">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold text-foreground/90">{Number(selectedBook.rating).toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">{selectedBook.description}</p>
                      </div>

                      {selectedBook.details && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Details & Review</h4>
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line bg-muted/30 p-3 rounded-lg border border-border/40">
                            {selectedBook.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 font-semibold"
                      onClick={() => { handleAdd(selectedBook); setSelectedBook(null); }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 font-semibold"
                      onClick={() => { handleOrderNow(selectedBook); setSelectedBook(null); }}
                    >
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reader Reviews & Comments */}
              <div className="border-t my-6" />

              <div className="space-y-6">
                <h3 className="font-heading text-lg text-primary flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-current" /> Reader Reviews & Comments ({reviews.length})
                </h3>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {loadingReviews ? (
                    <p className="text-sm text-muted-foreground">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No reviews yet. Be the first to leave a comment!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="p-3 bg-muted/40 rounded-lg border border-border/50 text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">{review.profiles?.full_name || "Reader"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.rating && (
                          <div className="flex text-amber-500 gap-0.5">
                            {Array.from({ length: review.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        )}
                        <p className="text-foreground/80 mt-1.5 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-dashed">
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Write a Review</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground mr-1">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none transition-colors"
                            >
                              <Star className={`w-5 h-5 ${star <= newRating ? "text-amber-500 fill-current" : "text-muted-foreground/30"}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        placeholder="Share your thoughts about this book..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full text-sm rounded-md border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      />

                      <Button type="submit" size="sm" disabled={submittingReview} className="font-semibold">
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-muted/30 p-4 rounded-lg text-center border space-y-2">
                      <p className="text-sm text-muted-foreground">You must be logged in to leave a review.</p>
                      <Button onClick={() => { setSelectedBook(null); navigate("/login"); }} variant="outline" size="sm">
                        Login Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Books;
