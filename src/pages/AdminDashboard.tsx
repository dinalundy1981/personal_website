import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, GraduationCap, Calendar, FileText, Mail, Mic, Video, Send, LogOut, Plus, Trash2, Edit, Eye, EyeOff, ImageIcon, CreditCard, ShoppingCart, Check, X as XIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp } from "@/lib/animations";
import SiteImagesManager from "@/components/admin/SiteImagesManager";
import ImageUploadField from "@/components/admin/ImageUploadField";

type TableName = "books" | "courses" | "events" | "blogs" | "newsletters" | "podcasts" | "media" | "publishing" | "works_in_progress";

const IMAGE_FIELDS = ["image_url", "thumbnail_url", "image1_url", "image2_url", "image3_url"];

const tabConfig: { key: TableName; label: string; icon: any; fields: { name: string; type: string; required?: boolean; options?: { value: string; label: string }[]; showWhen?: { field: string; value: string } }[] }[] = [
  {
    key: "books", label: "Books", icon: Book,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "price", type: "number", required: true },
      { name: "image_url", type: "image" },
      { name: "category", type: "text" },
    ],
  },
  {
    key: "courses", label: "Courses", icon: GraduationCap,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "price", type: "number", required: true },
      { name: "image_url", type: "image" },
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
      { name: "image_url", type: "image" },
      { name: "max_attendees", type: "number" },
    ],
  },
  {
    key: "blogs", label: "Blog Posts", icon: FileText,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "content", type: "textarea" },
      { name: "excerpt", type: "textarea" },
      { name: "image_url", type: "image" },
      { name: "author", type: "text" },
    ],
  },
  {
    key: "newsletters", label: "Newsletters", icon: Mail,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "content", type: "textarea" },
      { name: "image1_url", type: "image" },
      { name: "image2_url", type: "image" },
      { name: "image3_url", type: "image" },
    ],
  },
  {
    key: "podcasts", label: "Podcasts", icon: Mic,
    fields: [
      { name: "podcast_format", type: "select", required: true, options: [{ value: "audio", label: "Audio" }, { value: "video", label: "Video" }] },
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "category", type: "text" },
      { name: "episode_number", type: "number" },
      { name: "duration", type: "text" },
      { name: "published_at", type: "date" },
      { name: "audio_url", type: "text", showWhen: { field: "podcast_format", value: "audio" } },
      { name: "video_url", type: "text", showWhen: { field: "podcast_format", value: "video" } },
      { name: "image_url", type: "image" },
    ],
  },
  {
    key: "media", label: "Media", icon: Video,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "media_type", type: "text" },
      { name: "url", type: "text" },
      { name: "thumbnail_url", type: "image" },
    ],
  },
  {
    key: "publishing", label: "Publishing", icon: Book,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "author", type: "text" },
      { name: "publication_type", type: "text" },
      { name: "abstract", type: "textarea" },
      { name: "description", type: "textarea" },
      { name: "url", type: "text" },
      { name: "image_url", type: "image" },
      { name: "published_date", type: "date" },
    ],
  },
  {
    key: "works_in_progress", label: "Works in Progress", icon: FileText,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "author", type: "text" },
      { name: "description", type: "textarea" },
      { name: "url", type: "text" },
      { name: "image_url", type: "image" },
      { name: "expected_date", type: "text" },
    ],
  },
];

const TedxVideoManager = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("site_images").select("*").eq("section", "tedx_video").single()
      .then(({ data }) => {
        if (data) { setVideoUrl(data.image_url); setExistingId(data.id); }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (existingId) {
      await supabase.from("site_images").update({ image_url: videoUrl }).eq("id", existingId);
    } else {
      const { data } = await supabase.from("site_images").insert({ section: "tedx_video", image_url: videoUrl, label: "TEDx Video" }).select().single();
      if (data) setExistingId(data.id);
    }
    setSaving(false);
    toast({ title: "Video URL saved!" });
  };

  const handleDelete = async () => {
    if (!existingId) return;
    await supabase.from("site_images").delete().eq("id", existingId);
    setVideoUrl(""); setExistingId(null);
    toast({ title: "Video removed" });
  };

  const embedUrl = videoUrl ? (() => {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  })() : null;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-primary mb-4">TEDx Video (Work With Me Page)</h2>
        <div className="bg-background rounded-xl border p-6 space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">YouTube Video URL</label>
            <Input placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Paste any YouTube URL (watch, share, or embed link)</p>
          </div>
          {embedUrl && (
            <div className="aspect-video rounded-lg overflow-hidden border">
              <iframe src={embedUrl} title="Preview" className="w-full h-full" allowFullScreen />
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !videoUrl.trim()}>{saving ? "Saving..." : existingId ? "Update Video" : "Save Video"}</Button>
            {existingId && <Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-1" /> Remove</Button>}
          </div>
        </div>
      </div>

      <WorkWithMeImageManager />
    </motion.div>
  );
};

const WorkWithMeImageManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("site_images").select("*").eq("section", "work_with_me_image").single()
      .then(({ data }) => {
        if (data) { setImageUrl(data.image_url); setExistingId(data.id); }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (existingId) {
      await supabase.from("site_images").update({ image_url: imageUrl }).eq("id", existingId);
    } else {
      const { data } = await supabase.from("site_images").insert({ section: "work_with_me_image", image_url: imageUrl, label: "Work With Me Image" }).select().single();
      if (data) setExistingId(data.id);
    }
    setSaving(false);
    toast({ title: "Image saved!" });
  };

  const handleDelete = async () => {
    if (!existingId) return;
    await supabase.from("site_images").delete().eq("id", existingId);
    setImageUrl(""); setExistingId(null);
    toast({ title: "Image removed" });
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-primary mb-4">Coaching Image (Work With Me Page)</h2>
      <div className="bg-background rounded-xl border p-6 space-y-4 max-w-2xl">
        <ImageUploadField label="Coaching Image" value={imageUrl} onChange={setImageUrl} />
        {imageUrl && (
          <div className="w-48 rounded-lg overflow-hidden border">
            <img src={imageUrl} alt="Preview" className="w-full h-auto" />
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || !imageUrl.trim()}>{saving ? "Saving..." : existingId ? "Update Image" : "Save Image"}</Button>
          {existingId && <Button variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-1" /> Remove</Button>}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("books");
  const [items, setItems] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [pmForm, setPmForm] = useState<Record<string, any>>({});
  const [pmEditingId, setPmEditingId] = useState<string | null>(null);
  const [pmDialogOpen, setPmDialogOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [courseOrders, setCourseOrders] = useState<any[]>([]);
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "payment-methods") fetchPaymentMethods();
      else if (activeTab === "orders") fetchOrders();
      else if (activeTab === "contacts") fetchContacts();
      else if (activeTab !== "site-images") fetchItems();
    }
  }, [activeTab, isAdmin]);

  const fetchItems = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from(activeTab as TableName).select("*").order("created_at", { ascending: false });
    if (!error) setItems(data || []);
    setLoadingData(false);
  };

  const fetchContacts = async () => {
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    if (data) setContacts(data);
  };

  const fetchPaymentMethods = async () => {
    setLoadingData(true);
    const { data } = await supabase.from("payment_methods").select("*").order("created_at", { ascending: false });
    if (data) setPaymentMethods(data);
    setLoadingData(false);
  };

  const fetchOrders = async () => {
    setLoadingData(true);
    const [bookRes, courseRes] = await Promise.all([
      supabase.from("book_orders").select("*, books(title, image_url)").order("created_at", { ascending: false }),
      supabase.from("course_orders").select("*, courses(title, image_url)").order("created_at", { ascending: false }),
    ]);
    if (bookRes.data) setOrders(bookRes.data);
    if (courseRes.data) setCourseOrders(courseRes.data);
    setLoadingData(false);
  };

  const handleSave = async () => {
    const config = tabConfig.find((t) => t.key === activeTab)!;
    const payload: Record<string, any> = {};
    config.fields.forEach((f) => {
      // Clear fields whose showWhen condition isn't met
      if (f.showWhen && formData[f.showWhen.field] !== f.showWhen.value) {
        if (editingId) payload[f.name] = null;
        return;
      }
      if (formData[f.name] !== undefined && formData[f.name] !== "") {
        payload[f.name] = f.type === "number" ? Number(formData[f.name]) : formData[f.name];
      }
    });

    let error;
    if (editingId) {
      ({ error } = await supabase.from(activeTab as TableName).update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from(activeTab as TableName).insert(payload as any));
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
    const { error } = await supabase.from(activeTab as TableName).delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted!" });
      fetchItems();
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from(activeTab as TableName).update({ is_published: !current }).eq("id", id);
    fetchItems();
  };

  const openEdit = (item: any) => { setFormData(item); setEditingId(item.id); setDialogOpen(true); };
  const openNew = () => { setFormData({}); setEditingId(null); setDialogOpen(true); };

  // Payment methods CRUD
  const handleSavePM = async () => {
    const payload = { label: pmForm.label, method_type: pmForm.method_type || "paypal", details: pmForm.details || null, is_active: pmForm.is_active !== false };
    let error;
    if (pmEditingId) {
      ({ error } = await supabase.from("payment_methods").update(payload).eq("id", pmEditingId));
    } else {
      ({ error } = await supabase.from("payment_methods").insert(payload as any));
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: pmEditingId ? "Updated!" : "Created!" }); setPmDialogOpen(false); setPmForm({}); setPmEditingId(null); fetchPaymentMethods(); }
  };

  const handleDeletePM = async (id: string) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchPaymentMethods();
  };

  // Order actions
  const handleOrderStatus = async (id: string, status: string) => {
    await supabase.from("book_orders").update({ status } as any).eq("id", id);
    toast({ title: `Order ${status}!` });
    fetchOrders();
  };

  const handleCourseOrderStatus = async (id: string, status: string) => {
    await supabase.from("course_orders").update({ status } as any).eq("id", id);
    toast({ title: `Course order ${status}!` });
    fetchOrders();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const currentConfig = tabConfig.find((t) => t.key === activeTab);

  return (
    <div className="min-h-screen bg-muted/30">
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto bg-background border p-2 rounded-xl mb-8">
            {tabConfig.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-1.5 text-xs sm:text-sm">
                <tab.icon className="w-4 h-4" /> {tab.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <ShoppingCart className="w-4 h-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CreditCard className="w-4 h-4" /> Payment Methods
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Send className="w-4 h-4" /> Contacts
            </TabsTrigger>
            <TabsTrigger value="site-images" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <ImageIcon className="w-4 h-4" /> Site Images
            </TabsTrigger>
            <TabsTrigger value="tedx-video" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Play className="w-4 h-4" /> TEDx Video
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
                        {tab.fields.filter((field) => {
                          if (field.showWhen) return formData[field.showWhen.field] === field.showWhen.value;
                          return true;
                        }).map((field) => (
                          <div key={field.name}>
                            {field.type === "image" ? (
                              <ImageUploadField label={field.name.replace(/_/g, " ")} value={formData[field.name] || ""} onChange={(url) => setFormData({ ...formData, [field.name]: url })} />
                            ) : field.type === "select" && field.options ? (
                              <>
                                <label className="block text-sm font-medium text-foreground mb-1 capitalize">{field.name.replace(/_/g, " ")}</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData[field.name] || field.options[0]?.value || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}>
                                  {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                              </>
                            ) : (
                              <>
                                <label className="block text-sm font-medium text-foreground mb-1 capitalize">{field.name.replace(/_/g, " ")}</label>
                                {field.type === "textarea" ? (
                                  <Textarea value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} rows={3} />
                                ) : (
                                  <Input
                                    type={field.type === "number" ? "number" : field.type === "datetime-local" ? "datetime-local" : field.type === "date" ? "date" : "text"}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    required={field.required}
                                    step={field.type === "number" ? "0.01" : undefined}
                                  />
                                )}
                              </>
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
                            <th className="text-left p-3 font-medium">Image</th>
                            <th className="text-left p-3 font-medium">Title</th>
                            <th className="text-left p-3 font-medium hidden md:table-cell">Created</th>
                            <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
                            <th className="text-right p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => {
                            const imgUrl = item.image_url || item.thumbnail_url || item.image1_url;
                            return (
                              <tr key={item.id} className="border-t hover:bg-muted/20 transition-colors">
                                <td className="p-3">
                                  {imgUrl ? <img src={imgUrl} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>}
                                </td>
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
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}

          {/* Orders Tab */}
          <TabsContent value="orders">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <h2 className="font-heading text-2xl text-primary mb-6">Book Orders</h2>
              {loadingData ? <p className="text-muted-foreground">Loading...</p> : orders.length === 0 ? (
                <div className="text-center py-12 bg-background rounded-xl border"><p className="text-muted-foreground">No orders yet.</p></div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-background rounded-xl border p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {order.books?.image_url && <img src={order.books.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{order.books?.title || "Unknown Book"}</h3>
                          <div className="text-sm text-muted-foreground space-y-0.5 mt-1">
                            <p>Qty: {order.quantity} · Total: ${Number(order.total_price).toFixed(2)}</p>
                            <p>Phone: {order.phone || "N/A"} · Country: {order.country || "N/A"}</p>
                            <p>Payment: {order.payment_method || "N/A"} · Email: {order.payment_email || "N/A"}</p>
                            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "approved" ? "bg-green-100 text-green-700" :
                            order.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                          {order.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="default" onClick={() => handleOrderStatus(order.id, "approved")}>
                                <Check className="w-3 h-3 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleOrderStatus(order.id, "rejected")}>
                                <XIcon className="w-3 h-3 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl text-primary">Payment Methods</h2>
                <Dialog open={pmDialogOpen} onOpenChange={setPmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" onClick={() => { setPmForm({}); setPmEditingId(null); setPmDialogOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>{pmEditingId ? "Edit" : "Add"} Payment Method</DialogTitle></DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Label</label>
                        <Input placeholder="e.g. PayPal - business@email.com" value={pmForm.label || ""} onChange={(e) => setPmForm({ ...pmForm, label: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={pmForm.method_type || "paypal"} onChange={(e) => setPmForm({ ...pmForm, method_type: e.target.value })}>
                          <option value="paypal">PayPal</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="mobile_apps">Mobile Apps</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Details (shown to buyers)</label>
                        <Textarea placeholder="Account info, instructions, etc." value={pmForm.details || ""} onChange={(e) => setPmForm({ ...pmForm, details: e.target.value })} rows={4} />
                      </div>
                      <Button onClick={handleSavePM} className="w-full" disabled={!pmForm.label?.trim()}>{pmEditingId ? "Update" : "Create"}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {loadingData ? <p className="text-muted-foreground">Loading...</p> : paymentMethods.length === 0 ? (
                <div className="text-center py-12 bg-background rounded-xl border"><p className="text-muted-foreground">No payment methods yet. Add your first one!</p></div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="bg-background rounded-xl border p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{pm.label}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{pm.method_type.replace(/_/g, " ")}</p>
                        {pm.details && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{pm.details}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setPmForm(pm); setPmEditingId(pm.id); setPmDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeletePM(pm.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Site Images Tab */}
          <TabsContent value="site-images">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <SiteImagesManager />
            </motion.div>
          </TabsContent>

          {/* TEDx Video Tab */}
          <TabsContent value="tedx-video">
            <TedxVideoManager />
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <h2 className="font-heading text-2xl text-primary mb-6">Contact Messages</h2>
              {contacts.length === 0 ? (
                <div className="text-center py-12 bg-background rounded-xl border"><p className="text-muted-foreground">No contact messages yet.</p></div>
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
