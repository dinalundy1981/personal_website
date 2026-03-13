import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteImage {
  id: string;
  section: string;
  image_url: string;
  label: string | null;
}

export const useSiteImages = () => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_images").select("*");
      if (data) {
        const map: Record<string, string> = {};
        (data as SiteImage[]).forEach((img) => {
          map[img.section] = img.image_url;
        });
        setImages(map);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { images, loading };
};
