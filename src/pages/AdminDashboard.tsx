import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, GraduationCap, Calendar, FileText, Mail, Mic, Video, Send, LogOut, Plus, Trash2, Edit, Eye, EyeOff, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp } from "@/lib/animations";

type TableName = "books" | "courses" | "events" | "blogs" | "newsletters" | "podcasts" | "media" | "publishing";

const tabConfig: { key: TableName; label: string; icon: any; fields: { name: string; type: string; required?: boolean }[] }[] = [
  {
    key: "books", label: "Books", icon: Book,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "price", type: "number", required: true },
      { name: "image_url", type: "text" },
      { name: "category", type: "text" },
    ],
  },
  {
    key: "courses", label: "Courses", icon: GraduationCap,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "price", type: "number", required: true },
      { name: "image_url", type: "text" },
      { name: "category", type: "text" },
    ],
  },
  {
    key: "events", label: "Events", icon: Calendar,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "date", type: "datetime-local", required: true },
      { name: "location", type: "text" },
      { name: "image_url", type: "text" },
      { name: "max_attendees", type: "number" },
    ],
  },
  {
    key: "blogs", label: "Blog Posts", icon: FileText,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "content", type: "textarea" },
      { name: "excerpt", type: "textarea" },
      { name: "image_url", type: "text" },
      { name: "author", type: "text" },
    ],
  },
  {
    key: "newsletters", label: "Newsletters", icon: Mail,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "content", type: "textarea" },
      { name: "image1_url", type: "text" },
      { name: "image2_url", type: "text" },
      { name: "image3_url", type: "text" },
    ],
  },
  {
    key: "podcasts", label: "Podcasts", icon: Mic,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "audio_url", type: "text" },
      { name: "episode_number", type: "number" },
      { name: "duration", type: "text" },
      { name: "image_url", type: "text" },
    ],
  },
  {
    key: "media", label: "Media", icon: Video,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "media_type", type: "text" },
      { name: "url", type: "text" },
      { name: "thumbnail_url", type: "text" },
    ],
  },
  {
    key: "publishing", label: "Publishing", icon: Book,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "publication_type", type: "text" },
      { name: "url", type: "text" },
      { name: "image_url", type: "text" },
      { name: "published_date", type: "date" },
    ],
  },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TableName>("books");
  const [items, setItems] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchItems();
      fetchContacts();
    }
  }, [activeTab, isAdmin]);

  const fetchItems = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from(activeTab).select("*").order("created_at", { ascending: false });
    if (!error) setItems(data || []);
    setLoadingData(false);
  };

  const fetchContacts = async () => {
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (data) setContacts(data);
  };

  const handleSave = async () => {
    const config = tabConfig.find((t) => t.key === activeTab)!;
    const payload: Record<string, any> = {};
    config.fields.forEach((f) => {
      if (formData[f.name] !== undefined && formData[f.name] !== "") {
        payload[f.name] = f.type === "number" ? Number(formData[f.name]) : formData[f.name];
      }
    });

    let error;
    if (editingId) {
      ({ error } = await supabase.from(activeTab).update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from(activeTab).insert(payload as any));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Updated!" : "Created!" });
      setDialogOpen(false);
      setFormData({});
      setEditingId(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(activeTab).delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted!" });
      fetchItems();
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from(activeTab).update({ is_published: !current }).eq("id", id);
    fetchItems();
  };

  const openEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const openNew = () => {
    setFormData({});
    setEditingId(null);
    setDialogOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const currentConfig = tabConfig.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <h1 className="font-heading text-2xl">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-foreground/70">{user?.email}</span>
            <Button variant="warm" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TableName)}>
          <TabsList className="flex flex-wrap gap-1 h-auto bg-background border p-2 rounded-xl mb-8">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-1.5 text-xs sm:text-sm">
                <tab.icon className="w-4 h-4" /> {tab.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value={"contacts" as any} className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Send className="w-4 h-4" /> Contacts
            </TabsTrigger>
          </TabsList>

          {/* Content Tables */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl text-primary">Manage {tab.label}</h2>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add {tab.label.replace(/s$/, "")}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingId ? "Edit" : "Add"} {tab.label.replace(/s$/, "")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {tab.fields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-foreground mb-1 capitalize">{field.name.replace(/_/g, " ")}</label>
                            {field.type === "textarea" ? (
                              <Textarea value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} rows={3} />
                            ) : (
                              <Input type={field.type === "number" ? "number" : field.type === "datetime-local" ? "datetime-local" : field.type === "date" ? "date" : "text"} value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} required={field.required} step={field.type === "number" ? "0.01" : undefined} />
                            )}
                          </div>
                        ))}
                        <Button onClick={handleSave} className="w-full">{editingId ? "Update" : "Create"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {loadingData ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : items.length === 0 ? (
                  <div className="text-center py-12 bg-background rounded-xl border">
                    <p className="text-muted-foreground">No {tab.label.toLowerCase()} yet. Add your first one!</p>
                  </div>
                ) : (
                  <div className="bg-background rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">Title</th>
                            <th className="text-left p-3 font-medium hidden md:table-cell">Created</th>
                            <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-muted/20 transition-colors">
                              <td className="p-3 font-medium">{item.title}</td>
                              <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(item.created_at).toLocaleDateString()}</td>
                              <td className="p-3 hidden sm:table-cell">
                                <span className={`px-2 py-1 rounded-full text-xs ${item.is_published !== false ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                  {item.is_published !== false ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(item.id, item.is_published !== false)}>
                                    {item.is_published !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}

          {/* Contacts Tab */}
          <TabsContent value={"contacts" as any}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <h2 className="font-heading text-2xl text-primary mb-6">Contact Messages</h2>
              {contacts.length === 0 ? (
                <div className="text-center py-12 bg-background rounded-xl border">
                  <p className="text-muted-foreground">No contact messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((c) => (
                    <div key={c.id} className={`bg-background rounded-xl border p-5 ${c.is_read ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{c.name}</h3>
                          <p className="text-sm text-muted-foreground">{c.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{c.message}</p>
                      {!c.is_read && (
                        <Button variant="ghost" size="sm" className="mt-2" onClick={async () => {
                          await supabase.from("contacts").update({ is_read: true }).eq("id", c.id);
                          fetchContacts();
                        }}>Mark as read</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
