import { useState, useRef } from "react";
import { Upload, FileText, Headphones, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookFileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept: string;
  label: string;
}

const BookFileUpload = ({ value, onChange, accept, label }: BookFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 50MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("book-files").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("book-files").getPublicUrl(filePath);
    onChange(urlData.publicUrl);
    toast({ title: "File uploaded successfully!" });
    setUploading(false);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isPdf = value && (value.endsWith(".pdf") || value.includes(".pdf"));
  const isAudio = value && (value.endsWith(".mp3") || value.endsWith(".wav") || value.endsWith(".m4a") || value.endsWith(".ogg"));

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
          {isPdf ? <FileText className="w-5 h-5 text-red-500" /> : <Headphones className="w-5 h-5 text-blue-500" />}
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary underline truncate flex-1">
            {value.split("/").pop()}
          </a>
          <Button variant="ghost" size="sm" onClick={handleRemove}><X className="w-4 h-4" /></Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4 mr-2" /> Upload {label}</>
          )}
        </Button>
      )}
    </div>
  );
};

export default BookFileUpload;
