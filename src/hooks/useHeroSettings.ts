import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSettings {
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

export const useHeroSettings = () => {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("homepage_hero_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data as HeroSettings);
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
};
