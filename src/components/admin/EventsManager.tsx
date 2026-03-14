import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EventsManager = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [expandedReg, setExpandedReg] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  };

  const openNew = () => {
    setForm({});
    setEventImages([]);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = async (item: any) => {
    setForm(item);
    setEditingId(item.id);
    // Load existing images
    const { data } = await supabase.from("event_images").select("*").eq("event_id", item.id).order("sort_order", { ascending: true });
    setEventImages((data || []).map((i: any) => i.image_url));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      title: form.title,
      description: form.description || null,
      date: form.date,
      close_date: form.close_date || null,
      location: form.location || null,
      image_url: form.image_url || null,
      max_attendees: form.max_attendees ? Number(form.max_attendees) : null,
    };

    let eventId = editingId;
    let error;

    if (editingId) {
      ({ error } = await supabase.from("events").update(payload).eq("id", editingId));
    } else {
      const res = await supabase.from("events").insert(payload).select("id").single();
      error = res.error;
      eventId = res.data?.id || null;
    }

    if (error || !eventId) {
      toast({ title: "Error", description: error?.message || "Failed to save", variant: "destructive" });
      return;
    }

    // Sync event images: delete old, insert new
    await supabase.from("event_images").delete().eq("event_id", eventId);
    if (eventImages.length > 0) {
      const imageRows = eventImages.map((url, idx) => ({
        event_id: eventId!,
        image_url: url,
        sort_order: idx,
      }));
      await supabase.from("event_images").insert(imageRows as any);
    }

    toast({ title: editingId ? "Event updated!" : "Event created!" });
    setDialogOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted!" });
    fetchEvents();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from("events").update({ is_published: !current }).eq("id", id);
    fetchEvents();
  };

  const fetchRegistrations = async (eventId: string) => {
    if (expandedReg === eventId) { setExpandedReg(null); return; }
    const { data } = await supabase.from("event_registrations").select("*").eq("event_id", eventId).order("created_at", { ascending: false });
    setRegistrations((prev) => ({ ...prev, [eventId]: data || [] }));
    setExpandedReg(eventId);
  };

  const addImageSlot = () => setEventImages([...eventImages, ""]);
  const removeImage = (idx: number) => setEventImages(eventImages.filter((_, i) => i !== idx));
  const updateImage = (idx: number, url: string) => {
    const copy = [...eventImages];
    copy[idx] = url;
    setEventImages(copy);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl text-primary">Manage Events</h2>
        <Button variant="secondary" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Event</Button>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Event Date *</label>
                <Input type="datetime-local" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Close Date</label>
                <Input type="datetime-local" value={form.close_date || ""} onChange={(e) => setForm({ ...form, close_date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Location</label>
              <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Max Attendees</label>
              <Input type="number" value={form.max_attendees || ""} onChange={(e) => setForm({ ...form, max_attendees: e.target.value })} />
            </div>

            <ImageUploadField label="Main Image" value={form.image_url || ""} onChange={(url) => setForm({ ...form, image_url: url })} />

            {/* Additional Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">Additional Photos</label>
                <Button type="button" variant="outline" size="sm" onClick={addImageSlot}>
                  <Plus className="w-3 h-3 mr-1" /> Add Photo
                </Button>
              </div>
              <div className="space-y-3">
                {eventImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <ImageUploadField label={`Photo ${idx + 1}`} value={url} onChange={(u) => updateImage(idx, u)} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full" disabled={!form.title?.trim() || !form.date}>
              {editingId ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Events List */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">No events yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-card rounded-xl border overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                {event.image_url && <img src={event.image_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} · {event.location || "No location"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => fetchRegistrations(event.id)} title="View registrations">
                    <Users className="w-4 h-4" />
                    {expandedReg === event.id ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(event.id, event.is_published !== false)}>
                    {event.is_published !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(event)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Registrations Dropdown */}
              {expandedReg === event.id && (
                <div className="border-t bg-muted/20 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Registrations ({registrations[event.id]?.length || 0})</h4>
                  {(registrations[event.id] || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No registrations yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Name</th>
                            <th className="text-left p-2 font-medium">Email</th>
                            <th className="text-left p-2 font-medium hidden md:table-cell">Phone</th>
                            <th className="text-left p-2 font-medium hidden md:table-cell">Location</th>
                            <th className="text-left p-2 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations[event.id].map((reg: any) => (
                            <tr key={reg.id} className="border-b last:border-0">
                              <td className="p-2">{reg.name || "—"}</td>
                              <td className="p-2">{reg.email || "—"}</td>
                              <td className="p-2 hidden md:table-cell">{reg.phone || "—"}</td>
                              <td className="p-2 hidden md:table-cell">{reg.location || "—"}</td>
                              <td className="p-2 text-muted-foreground">{new Date(reg.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsManager;
