import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import type { AboutSettings } from "@/hooks/useAboutSettings";

const AboutSettingsManager = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("homepage_about_settings" as any)
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) setSettings(data as unknown as AboutSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const update = (key: keyof AboutSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, ...updates } = settings;
    const { error } = await supabase
      .from("homepage_about_settings" as any)
      .update(updates as any)
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "About section saved!" });
    }
  };

  if (!settings) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-primary">About Section Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the homepage "About Dr. Dina Lundy" section: title, subtitle, body text, statistics, and button.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-5 bg-card rounded-xl border p-6">
        <div>
          <Label>Eyebrow / Title (e.g. "About Dr. Dina Lundy")</Label>
          <Input value={settings.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Heading Line 1 (e.g. "The Voice of")</Label>
            <Input value={settings.heading_line1} onChange={(e) => update("heading_line1", e.target.value)} />
          </div>
          <div>
            <Label>Highlighted Subtitle (italic)</Label>
            <Input value={settings.heading_highlight} onChange={(e) => update("heading_highlight", e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Paragraph 1</Label>
          <Textarea rows={5} value={settings.paragraph1} onChange={(e) => update("paragraph1", e.target.value)} />
        </div>

        <div>
          <Label>Paragraph 2 (before quote)</Label>
          <Textarea rows={4} value={settings.paragraph2} onChange={(e) => update("paragraph2", e.target.value)} />
        </div>

        <div>
          <Label>Italic Quote</Label>
          <Input value={settings.quote} onChange={(e) => update("quote", e.target.value)} />
        </div>

        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Statistics</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Stat 1 Number</Label>
              <Input value={settings.stat1_number} onChange={(e) => update("stat1_number", e.target.value)} />
            </div>
            <div>
              <Label>Stat 1 Label</Label>
              <Input value={settings.stat1_label} onChange={(e) => update("stat1_label", e.target.value)} />
            </div>
            <div>
              <Label>Stat 2 Number</Label>
              <Input value={settings.stat2_number} onChange={(e) => update("stat2_number", e.target.value)} />
            </div>
            <div>
              <Label>Stat 2 Label</Label>
              <Input value={settings.stat2_label} onChange={(e) => update("stat2_label", e.target.value)} />
            </div>
            <div>
              <Label>Stat 3 Number</Label>
              <Input value={settings.stat3_number} onChange={(e) => update("stat3_number", e.target.value)} />
            </div>
            <div>
              <Label>Stat 3 Label</Label>
              <Input value={settings.stat3_label} onChange={(e) => update("stat3_label", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-foreground mb-3">Floating Badge (over photo collage)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Badge Number (e.g. "30+")</Label>
              <Input value={settings.badge_number} onChange={(e) => update("badge_number", e.target.value)} />
            </div>
            <div>
              <Label>Badge Label (e.g. "Years of Expertise")</Label>
              <Input value={settings.badge_label} onChange={(e) => update("badge_label", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <Label>Button Text</Label>
          <Input value={settings.button_text} onChange={(e) => update("button_text", e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default AboutSettingsManager;
