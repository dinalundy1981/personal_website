import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon, Video, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface Category { id: string; title: string; sort_order: number; }
interface MediaItem { id: string; category_id: string; image_url: string; subtitle: string | null; year: string | null; sort_order: number; }
interface FeaturedTalk { id: string; video_url: string; author_name: string | null; date: string | null; keywords: string | null; subtitle: string | null; description: string | null; thumbnail_url: string | null; sort_order: number; is_published: boolean; }

const MediaCategoriesManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [talks, setTalks] = useState<FeaturedTalk[]>([]);

  // Category dialog
  const [catDialog, setCatDialog] = useState(false);
  const [catForm, setCatForm] = useState<Record<string, any>>({});
  const [catEditId, setCatEditId] = useState<string | null>(null);

  // Item dialog
  const [itemDialog, setItemDialog] = useState(false);
  const [itemForm, setItemForm] = useState<Record<string, any>>({});
  const [itemEditId, setItemEditId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Talk dialog
  const [talkDialog, setTalkDialog] = useState(false);
  const [talkForm, setTalkForm] = useState<Record<string, any>>({});
  const [talkEditId, setTalkEditId] = useState<string | null>(null);

  const fetchAll = async () => {
    const [c, i, t] = await Promise.all([
      supabase.from("media_categories").select("*").order("sort_order"),
      supabase.from("media_items").select("*").order("sort_order"),
      supabase.from("featured_talks").select("*").order("sort_order"),
    ]);
    if (c.data) setCategories(c.data as Category[]);
    if (i.data) setItems(i.data as MediaItem[]);
    if (t.data) setTalks(t.data as FeaturedTalk[]);
  };

  useEffect(() => { fetchAll(); }, []);

  // Category CRUD
  const saveCat = async () => {
    const payload = { title: catForm.title, sort_order: Number(catForm.sort_order || 0) };
    let error;
    if (catEditId) {
      ({ error } = await supabase.from("media_categories").update(payload).eq("id", catEditId));
    } else {
      ({ error } = await supabase.from("media_categories").insert(payload as any));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: catEditId ? "Updated!" : "Created!" }); setCatDialog(false); setCatForm({}); setCatEditId(null); fetchAll(); }
  };

  const deleteCat = async (id: string) => {
    await supabase.from("media_categories").delete().eq("id", id);
    toast({ title: "Category deleted!" }); fetchAll();
  };

  // Item CRUD
  const saveItem = async () => {
    const payload = { category_id: itemForm.category_id || activeCategory, image_url: itemForm.image_url, subtitle: itemForm.subtitle || null, year: itemForm.year || null, sort_order: Number(itemForm.sort_order || 0) };
    let error;
    if (itemEditId) {
      ({ error } = await supabase.from("media_items").update(payload).eq("id", itemEditId));
    } else {
      ({ error } = await supabase.from("media_items").insert(payload as any));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: itemEditId ? "Updated!" : "Created!" }); setItemDialog(false); setItemForm({}); setItemEditId(null); fetchAll(); }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("media_items").delete().eq("id", id);
    toast({ title: "Image deleted!" }); fetchAll();
  };

  // Talk CRUD
  const saveTalk = async () => {
    const payload = {
      video_url: talkForm.video_url,
      author_name: talkForm.author_name || null,
      date: talkForm.date || null,
      keywords: talkForm.keywords || null,
      subtitle: talkForm.subtitle || null,
      description: talkForm.description || null,
      thumbnail_url: talkForm.thumbnail_url || null,
      sort_order: Number(talkForm.sort_order || 0),
      is_published: talkForm.is_published !== false,
    };
    let error;
    if (talkEditId) {
      ({ error } = await supabase.from("featured_talks").update(payload).eq("id", talkEditId));
    } else {
      ({ error } = await supabase.from("featured_talks").insert(payload as any));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: talkEditId ? "Updated!" : "Created!" }); setTalkDialog(false); setTalkForm({}); setTalkEditId(null); fetchAll(); }
  };

  const deleteTalk = async (id: string) => {
    await supabase.from("featured_talks").delete().eq("id", id);
    toast({ title: "Talk deleted!" }); fetchAll();
  };

  const getItemsForCat = (catId: string) => items.filter(i => i.category_id === catId);

  return (
    <div className="space-y-10">
      {/* ========== CATEGORIES ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-primary flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Media Categories</h2>
          <Button variant="secondary" size="sm" onClick={() => { setCatForm({}); setCatEditId(null); setCatDialog(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-xl border"><p className="text-muted-foreground text-sm">No categories yet.</p></div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card rounded-xl border p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-base text-foreground">{cat.title}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setActiveCategory(cat.id); setItemForm({ category_id: cat.id }); setItemEditId(null); setItemDialog(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Add Image
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setCatForm(cat); setCatEditId(cat.id); setCatDialog(true); }}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCat(cat.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {getItemsForCat(cat.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No images yet.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {getItemsForCat(cat.id).map((item) => (
                      <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                        <img src={item.image_url} alt={item.subtitle || ""} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => { setItemForm(item); setItemEditId(item.id); setActiveCategory(cat.id); setItemDialog(true); }}><Edit className="w-3 h-3" /></Button>
                          <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => deleteItem(item.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                        {item.year && <span className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-[9px] px-1.5 py-0.5 rounded font-semibold">{item.year}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== FEATURED TALKS ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-primary flex items-center gap-2"><Video className="w-5 h-5" /> Featured Talks</h2>
          <Button variant="secondary" size="sm" onClick={() => { setTalkForm({}); setTalkEditId(null); setTalkDialog(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Talk
          </Button>
        </div>

        {talks.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-xl border"><p className="text-muted-foreground text-sm">No featured talks yet.</p></div>
        ) : (
          <div className="space-y-3">
            {talks.map((talk) => (
              <div key={talk.id} className="bg-card rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {talk.thumbnail_url && <img src={talk.thumbnail_url} alt="" className="w-20 h-14 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{talk.subtitle || talk.video_url}</p>
                  <p className="text-xs text-muted-foreground">{talk.author_name || "—"} · {talk.date || "—"}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setTalkForm(talk); setTalkEditId(talk.id); setTalkDialog(true); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTalk(talk.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== DIALOGS ========== */}

      {/* Category Dialog */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{catEditId ? "Edit" : "Add"} Category</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input value={catForm.title || ""} onChange={e => setCatForm({ ...catForm, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <Input type="number" value={catForm.sort_order || 0} onChange={e => setCatForm({ ...catForm, sort_order: e.target.value })} />
            </div>
            <Button onClick={saveCat} className="w-full" disabled={!catForm.title?.trim()}>{catEditId ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{itemEditId ? "Edit" : "Add"} Image</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <ImageUploadField label="Image" value={itemForm.image_url || ""} onChange={url => setItemForm({ ...itemForm, image_url: url })} />
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <Input value={itemForm.subtitle || ""} onChange={e => setItemForm({ ...itemForm, subtitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Input value={itemForm.year || ""} onChange={e => setItemForm({ ...itemForm, year: e.target.value })} placeholder="e.g. 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <Input type="number" value={itemForm.sort_order || 0} onChange={e => setItemForm({ ...itemForm, sort_order: e.target.value })} />
            </div>
            <Button onClick={saveItem} className="w-full" disabled={!itemForm.image_url?.trim()}>{itemEditId ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Talk Dialog */}
      <Dialog open={talkDialog} onOpenChange={setTalkDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{talkEditId ? "Edit" : "Add"} Featured Talk</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">YouTube Video URL *</label>
              <Input value={talkForm.video_url || ""} onChange={e => setTalkForm({ ...talkForm, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle / Title</label>
              <Input value={talkForm.subtitle || ""} onChange={e => setTalkForm({ ...talkForm, subtitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author Name</label>
              <Input value={talkForm.author_name || ""} onChange={e => setTalkForm({ ...talkForm, author_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input value={talkForm.date || ""} onChange={e => setTalkForm({ ...talkForm, date: e.target.value })} placeholder="e.g. March 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
              <Input value={talkForm.keywords || ""} onChange={e => setTalkForm({ ...talkForm, keywords: e.target.value })} placeholder="education, psychology, youth" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <Textarea value={talkForm.description || ""} onChange={e => setTalkForm({ ...talkForm, description: e.target.value })} rows={3} />
            </div>
            <ImageUploadField label="Thumbnail (optional)" value={talkForm.thumbnail_url || ""} onChange={url => setTalkForm({ ...talkForm, thumbnail_url: url })} />
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <Input type="number" value={talkForm.sort_order || 0} onChange={e => setTalkForm({ ...talkForm, sort_order: e.target.value })} />
            </div>
            <Button onClick={saveTalk} className="w-full" disabled={!talkForm.video_url?.trim()}>{talkEditId ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaCategoriesManager;
