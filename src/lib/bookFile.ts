import { supabase } from "@/integrations/supabase/client";

export const openBookFile = async (
  path: string,
  onError?: (message: string) => void,
) => {
  const { data, error } = await supabase.storage.from("book-files").createSignedUrl(path, 60);
  if (error || !data?.signedUrl) {
    onError?.(error?.message || "Unable to open file.");
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
};
