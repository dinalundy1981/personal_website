import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import CheckoutDialog from "./CheckoutDialog";

const CartButton = () => {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary/80" onClick={() => setOpen(true)}>
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
      <CheckoutDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default CartButton;
