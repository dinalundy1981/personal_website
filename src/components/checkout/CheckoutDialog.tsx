import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowRight, CheckCircle, X, Minus, Plus } from "lucide-react";

interface PaymentMethod {
  id: string;
  method_type: string;
  label: string;
  details: string | null;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "India", "Brazil", "Mexico", "Nigeria", "South Africa", "Kenya", "Ghana",
  "Egypt", "Saudi Arabia", "UAE", "Japan", "South Korea", "Philippines", "Other",
];

const CheckoutDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"cart" | "info" | "payment">("cart");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && step === "payment") {
      supabase.from("payment_methods").select("*").eq("is_active", true).then(({ data }) => {
        if (data) setPaymentMethods(data);
      });
    }
  }, [open, step]);

  useEffect(() => {
    if (!open) {
      setStep("cart");
      setPhone("");
      setCountry("");
      setSelectedMethod("");
      setPaymentEmail("");
    }
  }, [open]);

  const handleSubmitOrder = async () => {
    if (!user) {
      toast({ title: "Please log in to complete your purchase", variant: "destructive" });
      return;
    }
    if (!paymentEmail.trim()) {
      toast({ title: "Please enter the email used for payment", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const bookItems = items.filter((i) => i.item_type === "book");
      const courseItems = items.filter((i) => i.item_type === "course");

      const orderPromises = [
        ...bookItems.map((item) =>
          supabase.from("book_orders").insert({
            book_id: item.id,
            user_id: user.id,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            status: "pending",
            phone,
            country,
            payment_method: selectedMethod,
            payment_email: paymentEmail,
          } as any)
        ),
        ...courseItems.map((item) =>
          supabase.from("course_orders").insert({
            course_id: item.id,
            user_id: user.id,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            status: "pending",
            phone,
            country,
            payment_method: selectedMethod,
            payment_email: paymentEmail,
          } as any)
        ),
      ];
      await Promise.all(orderPromises);
      clearCart();
      onOpenChange(false);
      toast({ title: "Order submitted!", description: "Your order is pending admin verification. You'll be notified once approved." });
    } catch {
      toast({ title: "Error submitting order", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto overflow-x-hidden">
        {step === "cart" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Your Cart</DialogTitle>
            </DialogHeader>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 mt-4 w-full">
                {items.map((item) => (
                  <div key={item.id} className="flex w-full min-w-0 gap-3 border rounded-lg p-3 relative items-start sm:items-center bg-card/30">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0 w-full">
                        <p className="font-semibold text-sm text-primary break-words line-clamp-2 pr-4 sm:pr-0 leading-snug">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-secondary font-heading text-sm">${item.price.toFixed(2)}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize font-medium">{item.item_type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-1 sm:mt-0 self-start sm:self-auto flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-md" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 rounded-md" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0 self-start sm:self-auto" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-heading text-lg">Total:</span>
                  <span className="font-heading text-2xl text-secondary">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full font-semibold" onClick={() => setStep("info")}>
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {step === "info" && (
          <>
            <DialogHeader>
              <DialogTitle>Your Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 w-full">
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Country</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("cart")}>Back</Button>
                <Button
                  className="flex-1"
                  disabled={!phone.trim() || !country}
                  onClick={() => setStep("payment")}
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 w-full">
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">How to complete your purchase:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Choose a payment method below.</li>
                  <li>Send <span className="font-heading text-secondary">${total.toFixed(2)}</span> using the payment details provided.</li>
                  <li>Enter the email address you used for the payment.</li>
                  <li>Click "Submit Order" — your order will be verified by the admin.</li>
                </ol>
              </div>

              {paymentMethods.length > 0 ? (
                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="grid gap-3">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="flex items-start gap-3 border rounded-lg p-3 w-full min-w-0 bg-card/30">
                      <RadioGroupItem value={pm.label} id={pm.id} className="mt-1 flex-shrink-0" />
                      <label htmlFor={pm.id} className="flex-1 cursor-pointer min-w-0 break-words">
                        <p className="font-semibold text-sm text-primary break-words">{pm.label}</p>
                        <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{pm.method_type.replace(/_/g, " ")}</p>
                        {pm.details && <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap break-words border-t pt-2 border-dashed">{pm.details}</p>}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-muted-foreground text-sm">No payment methods configured yet. Please contact the admin.</p>
              )}

              <div>
                <Label>Email used for payment</Label>
                <Input type="email" placeholder="your-payment@email.com" value={paymentEmail} onChange={(e) => setPaymentEmail(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>Back</Button>
                <Button
                  className="flex-1"
                  disabled={!selectedMethod || !paymentEmail.trim() || submitting}
                  onClick={handleSubmitOrder}
                >
                  <CheckCircle className="w-4 h-4 ml-1" /> {submitting ? "Submitting..." : "Submit Order"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
