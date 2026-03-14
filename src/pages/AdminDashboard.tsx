import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Book, GraduationCap, Calendar, FileText, Mail, Mic, Video, Send,
  LogOut, Plus, Trash2, Edit, Eye, EyeOff, ImageIcon, CreditCard,
  ShoppingCart, Check, X as XIcon, Play, LayoutDashboard, Settings,
  Users, BarChart3, Clock, TrendingUp, BookOpen, Newspaper, Image as ImageLucide, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp } from "@/lib/animations";
import SiteImagesManager from "@/components/admin/SiteImagesManager";
import ImageUploadField from "@/components/admin/ImageUploadField";
import BlogEditor from "@/components/admin/BlogEditor";
import MediaCategoriesManager from "@/components/admin/MediaCategoriesManager";
import EventsManager from "@/components/admin/EventsManager";
import PhilanthropyManager from "@/components/admin/PhilanthropyManager";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
    key: "blogs", label: "Blog", icon: FileText,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "content", type: "textarea" },
      { name: "excerpt", type: "textarea" },
      { name: "image_url", type: "image" },
      { name: "author", type: "text" },
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
    key: "publishing", label: "Publishing", icon: Newspaper,
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
    key: "works_in_progress", label: "Works in Progress", icon: BookOpen,
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

// ============= Sub-components =============

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
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl text-primary mb-4">TEDx Video (Work With Me Page)</h2>
        <div className="bg-card rounded-xl border p-6 space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">YouTube Video URL</label>
            <Input placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
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
    </div>
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
      <h2 className="font-heading text-xl text-primary mb-4">Coaching Image (Work With Me Page)</h2>
      <div className="bg-card rounded-xl border p-6 space-y-4 max-w-2xl">
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

// ============= Dashboard Stats =============

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(210, 70%, 55%)",
  "hsl(150, 60%, 45%)",
  "hsl(340, 65%, 55%)",
];

const DashboardView = () => {
  const [stats, setStats] = useState({ books: 0, courses: 0, users: 0, bookOrders: 0, courseOrders: 0, events: 0, blogs: 0, podcasts: 0 });
  const [pendingBookOrders, setPendingBookOrders] = useState<any[]>([]);
  const [pendingCourseOrders, setPendingCourseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      const [books, courses, profiles, bookOrders, courseOrders, events, blogs, podcasts, pendingBooks, pendingCourses] = await Promise.all([
        supabase.from("books").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("book_orders").select("id", { count: "exact", head: true }),
        supabase.from("course_orders").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("podcasts").select("id", { count: "exact", head: true }),
        supabase.from("book_orders").select("*, books(title, image_url)").eq("status", "pending").order("created_at", { ascending: false }).limit(10),
        supabase.from("course_orders").select("*, courses(title, image_url)").eq("status", "pending").order("created_at", { ascending: false }).limit(10),
      ]);
      setStats({
        books: books.count || 0,
        courses: courses.count || 0,
        users: profiles.count || 0,
        bookOrders: bookOrders.count || 0,
        courseOrders: courseOrders.count || 0,
        events: events.count || 0,
        blogs: blogs.count || 0,
        podcasts: podcasts.count || 0,
      });
      setPendingBookOrders(pendingBooks.data || []);
      setPendingCourseOrders(pendingCourses.data || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const handleOrderAction = async (id: string, status: string, type: "book" | "course") => {
    const table = type === "book" ? "book_orders" : "course_orders";
    await supabase.from(table).update({ status } as any).eq("id", id);
    toast({ title: `Order ${status}!` });
    // Refresh pending
    if (type === "book") {
      const { data } = await supabase.from("book_orders").select("*, books(title, image_url)").eq("status", "pending").order("created_at", { ascending: false }).limit(10);
      setPendingBookOrders(data || []);
    } else {
      const { data } = await supabase.from("course_orders").select("*, courses(title, image_url)").eq("status", "pending").order("created_at", { ascending: false }).limit(10);
      setPendingCourseOrders(data || []);
    }
  };

  if (loading) return <p className="text-muted-foreground p-8">Loading dashboard...</p>;

  const statCards = [
    { label: "Total Books", value: stats.books, icon: Book, color: "text-blue-600 bg-blue-50" },
    { label: "Total Courses", value: stats.courses, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Book Orders", value: stats.bookOrders, icon: ShoppingCart, color: "text-orange-600 bg-orange-50" },
    { label: "Course Orders", value: stats.courseOrders, icon: CreditCard, color: "text-pink-600 bg-pink-50" },
    { label: "Events", value: stats.events, icon: Calendar, color: "text-teal-600 bg-teal-50" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "text-indigo-600 bg-indigo-50" },
    { label: "Podcasts", value: stats.podcasts, icon: Mic, color: "text-rose-600 bg-rose-50" },
  ];

  const chartData = [
    { name: "Books", count: stats.books },
    { name: "Courses", count: stats.courses },
    { name: "Events", count: stats.events },
    { name: "Blogs", count: stats.blogs },
    { name: "Podcasts", count: stats.podcasts },
  ];

  const orderChartData = [
    { name: "Book Orders", value: stats.bookOrders },
    { name: "Course Orders", value: stats.courseOrders },
  ];

  const totalPending = pendingBookOrders.length + pendingCourseOrders.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl text-primary mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your website content and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-heading text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border p-5">
          <h3 className="font-heading text-sm text-primary mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Content Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border p-5">
          <h3 className="font-heading text-sm text-primary mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Orders Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {orderChartData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pending Approvals */}
      {totalPending > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" /> Pending Approvals ({totalPending})
          </h3>
          <div className="space-y-3">
            {pendingBookOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {order.books?.image_url && <img src={order.books.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{order.books?.title || "Book"}</p>
                    <p className="text-xs text-muted-foreground">Book · Qty: {order.quantity} · ${Number(order.total_price).toFixed(2)} · {order.payment_email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" onClick={() => handleOrderAction(order.id, "approved", "book")}>
                    <Check className="w-3 h-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleOrderAction(order.id, "rejected", "book")}>
                    <XIcon className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
            {pendingCourseOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {order.courses?.image_url && <img src={order.courses.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{order.courses?.title || "Course"}</p>
                    <p className="text-xs text-muted-foreground">Course · ${Number(order.total_price).toFixed(2)} · {order.payment_email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" onClick={() => handleOrderAction(order.id, "approved", "course")}>
                    <Check className="w-3 h-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleOrderAction(order.id, "rejected", "course")}>
                    <XIcon className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============= Sidebar =============

const sidebarNav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "books", label: "Books", icon: Book },
  { key: "courses", label: "Courses", icon: GraduationCap },
  { key: "events", label: "Events", icon: Calendar },
  { key: "blogs", label: "Blog", icon: FileText },
  { key: "podcasts", label: "Podcasts", icon: Mic },
  { key: "publishing", label: "Publishing", icon: Newspaper },
  { key: "media", label: "Media", icon: Video },
  { key: "newsletters", label: "Newsletters", icon: Mail },
  { key: "works_in_progress", label: "Works in Progress", icon: BookOpen },
  { key: "philanthropy", label: "Philanthropy", icon: Heart },
];

const sidebarNav2 = [
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "contacts", label: "Messages", icon: Send },
  { key: "subscribers", label: "Subscribers", icon: Users },
];

const sidebarSettings = [
  { key: "payment-methods", label: "Payment Methods", icon: CreditCard },
  { key: "site-images", label: "Site Images", icon: ImageLucide },
  { key: "tedx-video", label: "Work With Me Settings", icon: Play },
];

const AdminSidebar = ({ activeSection, onSectionChange }: { activeSection: string; onSectionChange: (s: string) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNav.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.key)}
                    isActive={activeSection === item.key}
                    tooltip={item.label}
                    className={`transition-colors ${activeSection === item.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNav2.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.key)}
                    isActive={activeSection === item.key}
                    tooltip={item.label}
                    className={`transition-colors ${activeSection === item.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarSettings.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.key)}
                    isActive={activeSection === item.key}
                    tooltip={item.label}
                    className={`transition-colors ${activeSection === item.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

// ============= Main Admin Dashboard =============

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [items, setItems] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [blogEditorOpen, setBlogEditorOpen] = useState(false);
  const [blogEditData, setBlogEditData] = useState<Record<string, any> | undefined>(undefined);

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [pmForm, setPmForm] = useState<Record<string, any>>({});
  const [pmEditingId, setPmEditingId] = useState<string | null>(null);
  const [pmDialogOpen, setPmDialogOpen] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [courseOrders, setCourseOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeSection === "payment-methods") fetchPaymentMethods();
    else if (activeSection === "orders") fetchOrders();
    else if (activeSection === "contacts") fetchContacts();
    else if (tabConfig.find(t => t.key === activeSection)) fetchItems();
  }, [activeSection, isAdmin]);

  const fetchItems = async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from(activeSection as TableName).select("*").order("created_at", { ascending: false });
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
    const config = tabConfig.find((t) => t.key === activeSection)!;
    const payload: Record<string, any> = {};
    config.fields.forEach((f) => {
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
      ({ error } = await supabase.from(activeSection as TableName).update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from(activeSection as TableName).insert(payload as any));
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
    const { error } = await supabase.from(activeSection as TableName).delete().eq("id", id);
    if (!error) { toast({ title: "Deleted!" }); fetchItems(); }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from(activeSection as TableName).update({ is_published: !current }).eq("id", id);
    fetchItems();
  };

  const openEdit = (item: any) => {
    if (activeSection === "blogs") { setBlogEditData(item); setBlogEditorOpen(true); return; }
    setFormData(item); setEditingId(item.id); setDialogOpen(true);
  };
  const openNew = () => {
    if (activeSection === "blogs") { setBlogEditData(undefined); setBlogEditorOpen(true); return; }
    setFormData({}); setEditingId(null); setDialogOpen(true);
  };

  const handleBlogSave = async (data: Record<string, any>) => {
    let error;
    if (blogEditData?.id) {
      ({ error } = await supabase.from("blogs").update(data).eq("id", blogEditData.id));
    } else {
      ({ error } = await supabase.from("blogs").insert(data as any));
    }
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: blogEditData?.id ? "Blog updated!" : "Blog created!" });
      setBlogEditorOpen(false);
      setBlogEditData(undefined);
      fetchItems();
    }
  };

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

  const currentConfig = tabConfig.find((t) => t.key === activeSection);

  const renderContent = () => {
    // Dashboard
    if (activeSection === "dashboard") return <DashboardView />;

    // Media categories manager
    if (activeSection === "media") return <MediaCategoriesManager />;

    // Events manager
    if (activeSection === "events") return <EventsManager />;

    // Philanthropy manager
    if (activeSection === "philanthropy") return <PhilanthropyManager />;

    // Blog editor
    if (activeSection === "blogs" && blogEditorOpen) {
      return (
        <BlogEditor
          initialData={blogEditData}
          onSave={handleBlogSave}
          onCancel={() => { setBlogEditorOpen(false); setBlogEditData(undefined); }}
        />
      );
    }

    // Content CRUD sections
    if (currentConfig) {
      return (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-primary">Manage {currentConfig.label}</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add {currentConfig.label.replace(/s$/, "")}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit" : "Add"} {currentConfig.label.replace(/s$/, "")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {currentConfig.fields.filter((field) => {
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
            <div className="text-center py-12 bg-card rounded-xl border">
              <p className="text-muted-foreground">No {currentConfig.label.toLowerCase()} yet. Add your first one!</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border overflow-hidden">
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
        </div>
      );
    }

    // Orders
    if (activeSection === "orders") {
      return (
        <div>
          <h2 className="font-heading text-xl text-primary mb-6">Book Orders</h2>
          {loadingData ? <p className="text-muted-foreground">Loading...</p> : orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border"><p className="text-muted-foreground">No book orders yet.</p></div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-card rounded-xl border p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {order.books?.image_url && <img src={order.books.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground">{order.books?.title || "Unknown Book"}</h3>
                      <p className="text-xs text-muted-foreground">Qty: {order.quantity} · ${Number(order.total_price).toFixed(2)} · {order.payment_method || "N/A"} · {order.payment_email || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{order.phone || ""} · {order.country || ""} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "approved" ? "bg-green-100 text-green-700" : order.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                      {order.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleOrderStatus(order.id, "approved")}><Check className="w-3 h-3" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleOrderStatus(order.id, "rejected")}><XIcon className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="font-heading text-xl text-primary mb-6 mt-10">Course Orders</h2>
          {loadingData ? <p className="text-muted-foreground">Loading...</p> : courseOrders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border"><p className="text-muted-foreground">No course orders yet.</p></div>
          ) : (
            <div className="space-y-3">
              {courseOrders.map((order: any) => (
                <div key={order.id} className="bg-card rounded-xl border p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {order.courses?.image_url && <img src={order.courses.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground">{order.courses?.title || "Unknown Course"}</h3>
                      <p className="text-xs text-muted-foreground">Qty: {order.quantity} · ${Number(order.total_price).toFixed(2)} · {order.payment_method || "N/A"} · {order.payment_email || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{order.phone || ""} · {order.country || ""} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "approved" ? "bg-green-100 text-green-700" : order.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                      {order.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleCourseOrderStatus(order.id, "approved")}><Check className="w-3 h-3" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCourseOrderStatus(order.id, "rejected")}><XIcon className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Payment Methods
    if (activeSection === "payment-methods") {
      return (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-primary">Payment Methods</h2>
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
            <div className="text-center py-12 bg-card rounded-xl border"><p className="text-muted-foreground">No payment methods yet.</p></div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="bg-card rounded-xl border p-4 flex items-start justify-between gap-4">
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
        </div>
      );
    }

    // Site Images
    if (activeSection === "site-images") return <SiteImagesManager />;

    // TEDx Video / Work With Me Settings
    if (activeSection === "tedx-video") return <TedxVideoManager />;

    // Contacts
    if (activeSection === "contacts") {
      return (
        <div>
          <h2 className="font-heading text-xl text-primary mb-6">Contact Messages</h2>
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border"><p className="text-muted-foreground">No contact messages yet.</p></div>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className={`bg-card rounded-xl border p-4 ${c.is_read ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
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
        </div>
      );
    }

    return null;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-heading text-lg text-primary hidden sm:block">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
