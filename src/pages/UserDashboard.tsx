import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fadeUp } from "@/lib/animations";
import { openBookFile } from "@/lib/bookFile";
import { User, BookOpen, GraduationCap, CalendarDays, Mail, Phone, Edit2, Save, FileText, Headphones } from "lucide-react";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [bookOrders, setBookOrders] = useState<any[]>([]);
  const [courseOrders, setCourseOrders] = useState<any[]>([]);
  const [eventRegs, setEventRegs] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, booksRes, coursesRes, eventsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("book_orders").select("*, books(title, image_url, book_format, file_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("course_orders").select("*, courses(title, image_url)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("event_registrations").select("*, events(title, date, location)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setForm({ full_name: profileRes.data.full_name || "", phone: profileRes.data.phone || "" });
      }
      setBookOrders(booksRes.data || []);
      setCourseOrders(coursesRes.data || []);
      setEventRegs(eventsRes.data || []);
    };
    fetchData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile({ ...profile, ...form });
      setEditing(false);
      toast({ title: "Profile Updated!" });
    }
  };

  const handleOpenBookFile = (path: string) => {
    openBookFile(path, (message) => toast({ title: "Unable to open file", description: message, variant: "destructive" }));
  };

  if (loading || !user) return null;

  return (
    <Layout>
      <section className="py-12 bg-warm/30 min-h-[80vh]">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="font-heading text-3xl text-primary mb-8">My Dashboard</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-lg">
                <TabsTrigger value="profile"><User className="w-4 h-4 mr-1" /> Profile</TabsTrigger>
                <TabsTrigger value="books"><BookOpen className="w-4 h-4 mr-1" /> Books</TabsTrigger>
                <TabsTrigger value="courses"><GraduationCap className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
                <TabsTrigger value="events"><CalendarDays className="w-4 h-4 mr-1" /> Events</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-primary">My Profile</CardTitle>
                    {!editing ? (
                      <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>
                    ) : (
                      <Button size="sm" onClick={handleSaveProfile}><Save className="w-4 h-4 mr-1" /> Save</Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Full Name</label>
                        {editing ? (
                          <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                        ) : (
                          <p className="text-foreground mt-1">{profile?.full_name || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                        <p className="text-foreground mt-1">{profile?.email || user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label>
                        {editing ? (
                          <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        ) : (
                          <p className="text-foreground mt-1">{profile?.phone || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="books">
                <Card>
                  <CardHeader><CardTitle className="text-primary">My Book Orders</CardTitle></CardHeader>
                  <CardContent>
                    {bookOrders.length === 0 ? (
                      <p className="text-muted-foreground">No book orders yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookOrders.map(order => (
                          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border gap-3">
                            <div>
                              <p className="font-medium text-foreground">{order.books?.title || "Book"}</p>
                              <p className="text-sm text-muted-foreground">Qty: {order.quantity} · ${order.total_price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {order.status === "approved" && order.books?.file_url && (
                                <Button size="sm" variant="outline" onClick={() => handleOpenBookFile(order.books.file_url)}>
                                  {order.books.book_format === "audio" ? (
                                    <><Headphones className="w-4 h-4 mr-1" /> Listen</>
                                  ) : (
                                    <><FileText className="w-4 h-4 mr-1" /> Read PDF</>
                                  )}
                                </Button>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full ${order.status === "approved" ? "bg-green-100 text-green-700" : order.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardHeader><CardTitle className="text-primary">My Course Orders</CardTitle></CardHeader>
                  <CardContent>
                    {courseOrders.length === 0 ? (
                      <p className="text-muted-foreground">No course enrollments yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {courseOrders.map(order => (
                          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div>
                              <p className="font-medium text-foreground">{order.courses?.title || "Course"}</p>
                              <p className="text-sm text-muted-foreground">${order.total_price}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader><CardTitle className="text-primary">My Event Registrations</CardTitle></CardHeader>
                  <CardContent>
                    {eventRegs.length === 0 ? (
                      <p className="text-muted-foreground">No event registrations yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {eventRegs.map(reg => (
                          <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div>
                              <p className="font-medium text-foreground">{reg.events?.title || "Event"}</p>
                              <p className="text-sm text-muted-foreground">{reg.events?.location} · {reg.events?.date ? new Date(reg.events.date).toLocaleDateString() : ""}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{reg.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default UserDashboard;
