import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploadField from "./ImageUploadField";

interface PhilanthropyCard {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
  created_at: string;
}

const PhilanthropyManager = () => {
  const [cards, setCards] = useState<PhilanthropyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const fetchCards = async () => {
    const { data } = await supabase
      .from("philanthropy_cards")
      .select("*")
      .order("sort_order", { ascending: true });
    setCards((data as PhilanthropyCard[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCards(); }, []);

  const openNew = () => {
    setForm({});
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (card: PhilanthropyCard) => {
    setForm(card);
    setEditingId(card.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) return;
    const payload = {
      title: form.title,
      description: form.description || null,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
      sort_order: Number(form.sort_order) || 0,
      is_published: form.is_published !== false,
    };
    if (editingId) {
      await supabase.from("philanthropy_cards").update(payload as any).eq("id", editingId);
      toast({ title: "Card updated!" });
    } else {
      await supabase.from("philanthropy_cards").insert(payload as any);
      toast({ title: "Card created!" });
    }
    setDialogOpen(false);
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("philanthropy_cards").delete().eq("id", id);
    toast({ title: "Card deleted" });
    fetchCards();
  };

  const togglePublish = async (card: PhilanthropyCard) => {
    await supabase.from("philanthropy_cards").update({ is_published: !card.is_published } as any).eq("id", card.id);
    fetchCards();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-primary">Manage Philanthropy Cards</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Card</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Card</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <ImageUploadField label="Image" value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} />
              <div>
                <label className="block text-sm font-medium mb-1">Read More Link (URL)</label>
                <Input value={form.link_url || ""} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <Input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!form.title?.trim()}>
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : cards.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">No philanthropy cards yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border p-4 flex items-start gap-4">
              {card.image_url && <img src={card.image_url} alt={card.title} className="w-20 h-14 object-cover rounded" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{card.title}</h3>
                {card.description && <p className="text-xs text-muted-foreground line-clamp-1">{card.description}</p>}
                {card.link_url && <p className="text-xs text-primary truncate">{card.link_url}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => togglePublish(card)}>
                  {card.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(card)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(card.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhilanthropyManager;
