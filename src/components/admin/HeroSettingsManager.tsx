import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface HeroSettings {
  id: string;
  badge_text: string;
  heading_main: string;
  heading_highlight: string;
  subtitle: string;
  description: string;
  books_count_number: string;
  books_count_label: string;
  forthcoming_label: string;
  forthcoming_title: string;
}

const HeroSettingsManager = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("homepage_hero_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) setSettings(data as HeroSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const update = (key: keyof HeroSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, ...updates } = settings;
    const { error } = await supabase
      .from("homepage_hero_settings")
      .update(updates)
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Hero settings saved!" });
    }
  };

  if (!settings) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-primary">Homepage Content Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the hero section text, badges, and book card content. To change the hero image, use Site Images.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-5 bg-card rounded-xl border p-6">
        <div>
          <Label>Top Badge Text</Label>
          <Input value={settings.badge_text} onChange={(e) => update("badge_text", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Main Heading</Label>
            <Textarea
              rows={3}
              value={settings.heading_main}
              onChange={(e) => update("heading_main", e.target.value)}
            />
          </div>
          <div>
            <Label>Highlighted Word(s) (italic)</Label>
            <Input
              value={settings.heading_highlight}
              onChange={(e) => update("heading_highlight", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Subtitle</Label>
          <Textarea rows={2} value={settings.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </div>

        <div>
          <Label>Description Paragraph</Label>
          <Textarea rows={4} value={settings.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Published Books Badge</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Number / Text (e.g. "5+")</Label>
              <Input
                value={settings.books_count_number}
                onChange={(e) => update("books_count_number", e.target.value)}
              />
            </div>
            <div>
              <Label>Label (e.g. "Published Books")</Label>
              <Input
                value={settings.books_count_label}
                onChange={(e) => update("books_count_label", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Forthcoming Book Card (clickable → Books page)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Small Label (e.g. "Forthcoming Release")</Label>
              <Input
                value={settings.forthcoming_label}
                onChange={(e) => update("forthcoming_label", e.target.value)}
              />
            </div>
            <div>
              <Label>Book Title</Label>
              <Input
                value={settings.forthcoming_title}
                onChange={(e) => update("forthcoming_title", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSettingsManager;
