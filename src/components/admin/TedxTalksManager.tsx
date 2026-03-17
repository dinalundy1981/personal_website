import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUploadField from "./ImageUploadField";

interface TedxTalk {
  id: string;
  title: string;
  author: string | null;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  is_published: boolean | null;
  created_at: string;
}

const getEmbedUrl = (url: string) => {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
};

const TedxTalksManager = () => {
  const [talks, setTalks] = useState<TedxTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const fetchTalks = async () => {
    setLoading(true);
    const { data } = await supabase.from("tedx_talks").select("*").order("created_at", { ascending: false });
    setTalks((data as TedxTalk[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchTalks(); }, []);

  const handleSave = async () => {
    const payload = {
      title: form.title,
      author: form.author || "Dr. Dina Lundy",
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url || null,
      description: form.description || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("tedx_talks").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("tedx_talks").insert(payload as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Updated!" : "Video added!" });
      setDialogOpen(false);
      setForm({});
      setEditingId(null);
      fetchTalks();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tedx_talks").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchTalks();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from("tedx_talks").update({ is_published: !current }).eq("id", id);
    fetchTalks();
  };

  const openEdit = (talk: TedxTalk) => {
    setForm(talk);
    setEditingId(talk.id);
    setDialogOpen(true);
  };

  const openNew = () => {
    setForm({});
    setEditingId(null);
    setDialogOpen(true);
  };

  const embedUrl = form.video_url ? getEmbedUrl(form.video_url) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-primary">Manage TEDxTalk Videos</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Video</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Talk title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Dr. Dina Lundy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video URL * (YouTube, Vimeo, etc.)</label>
                <Input value={form.video_url || ""} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              {embedUrl && (
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe src={embedUrl} title="Preview" className="w-full h-full" allowFullScreen />
                </div>
              )}
              <ImageUploadField label="Custom Thumbnail (optional)" value={form.thumbnail_url || ""} onChange={(url) => setForm({ ...form, thumbnail_url: url })} />
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!form.title || !form.video_url}>
                {editingId ? "Update" : "Add Video"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : talks.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <Play className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No videos yet. Add your first one!</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Video</th>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Author</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {talks.map((talk) => {
                  const ytMatch = talk.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
                  const thumb = talk.thumbnail_url || (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/default.jpg` : null);
                  return (
                    <tr key={talk.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        {thumb ? (
                          <img src={thumb} alt="" className="w-16 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-16 h-10 rounded bg-muted flex items-center justify-center"><Play className="w-4 h-4 text-muted-foreground" /></div>
                        )}
                      </td>
                      <td className="p-3 font-medium">{talk.title}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{talk.author}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${talk.is_published !== false ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {talk.is_published !== false ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(talk.id, talk.is_published !== false)}>
                            {talk.is_published !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(talk)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(talk.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TedxTalksManager;
