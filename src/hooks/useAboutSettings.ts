import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AboutSettings {
  id: string;
  eyebrow: string;
  heading_line1: string;
  heading_highlight: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  button_text: string;
  badge_number: string;
  badge_label: string;
}

export const useAboutSettings = () => {
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("homepage_about_settings" as any)
        .select("*")
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data as unknown as AboutSettings);
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
};
