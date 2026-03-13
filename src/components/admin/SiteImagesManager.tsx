import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadToImgBB } from "@/lib/imgbb";

const SECTIONS = [
  { key: "hero", label: "Hero Profile Photo" },
  { key: "about_1", label: "About - Top Left" },
  { key: "about_2", label: "About - Top Right" },
  { key: "about_3", label: "About - Bottom Left" },
  { key: "about_4", label: "About - Bottom Right" },
];

interface SiteImage {
  id: string;
  section: string;
  image_url: string;
  label: string | null;
}

const SiteImagesManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchImages = async () => {
    const { data } = await supabase.from("site_images").select("*");
    if (data) setImages(data as SiteImage[]);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const getImageForSection = (section: string) => images.find((img) => img.section === section);

  const handleUpload = async (section: string, file: File) => {
    setUploading(section);
    try {
      const imageUrl = await uploadToImgBB(file);

      const existing = getImageForSection(section);
      if (existing) {
        await supabase.from("site_images").update({ image_url: imageUrl, updated_at: new Date().toISOString() }).eq("id", existing.id);
      } else {
        await supabase.from("site_images").insert({ section, image_url: imageUrl, label: section } as any);
      }

      toast({ title: "Image uploaded!" });
      fetchImages();
    } catch {
      toast({ title: "Upload failed", description: "Could not upload image to ImgBB.", variant: "destructive" });
    }
    setUploading(null);
  };

  const handleDelete = async (section: string) => {
    const existing = getImageForSection(section);
    if (existing) {
      await supabase.from("site_images").delete().eq("id", existing.id);
      toast({ title: "Image removed" });
      fetchImages();
    }
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-primary mb-6">Site Images</h2>
      <p className="text-sm text-muted-foreground mb-6">Upload and manage images for the Home page hero section and About section.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((sec) => {
          const img = getImageForSection(sec.key);
          return (
            <div key={sec.key} className="bg-background rounded-xl border p-4">
              <p className="text-sm font-medium text-foreground mb-3">{sec.label}</p>
              {img ? (
                <div className="relative group">
                  <img src={img.image_url} alt={sec.label} className="w-full h-40 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => fileRefs.current[sec.key]?.click()} disabled={uploading === sec.key}>
                      <Upload className="w-4 h-4" /> Replace
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(sec.key)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRefs.current[sec.key]?.click()}
                  disabled={uploading === sec.key}
                  className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {uploading === sec.key ? (
                    <span className="text-sm">Uploading...</span>
                  ) : (
                    <>
                      <Image className="w-8 h-8" />
                      <span className="text-sm">Click to upload</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={(el) => { fileRefs.current[sec.key] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(sec.key, file);
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SiteImagesManager;
