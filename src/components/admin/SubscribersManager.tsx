import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from("email_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers((data as Subscriber[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("email_subscriptions").delete().eq("id", id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Subscriber removed" });
  };

  const handleExport = () => {
    const csv = "Email,Subscribed At\n" + subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl text-primary">Email Subscribers</h2>
          <p className="text-muted-foreground text-sm">{subscribers.length} total subscribers</p>
        </div>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No subscribers yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-t hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">{sub.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(sub.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscribersManager;
