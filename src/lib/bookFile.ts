import { supabase } from "@/integrations/supabase/client";

export const openBookFile = async (
  path: string,
  onError?: (message: string) => void,
) => {
  if (!path) {
    onError?.("File path is empty.");
    return;
  }

  // Extract relative path if the database contains a full Supabase URL
  let relativePath = path;
  if (path.startsWith("http")) {
    const parts = path.split("/book-files/");
    if (parts.length > 1) {
      relativePath = decodeURIComponent(parts[1].split("?")[0]);
    }
  }

  // Open window immediately to bypass browser popup blockers
  const newWindow = window.open("", "_blank", "noopener,noreferrer");
  if (newWindow) {
    newWindow.document.write("<p style='font-family: sans-serif; text-align: center; margin-top: 50px; color: #666;'>Loading your file securely, please wait...</p>");
  }

  const { data, error } = await supabase.storage.from("book-files").createSignedUrl(relativePath, 60);

  if (error || !data?.signedUrl) {
    if (newWindow) newWindow.close();
    onError?.(error?.message || "Unable to open file. Please contact support.");
    return;
  }

  if (newWindow) {
    newWindow.location.href = data.signedUrl;
  } else {
    // Fallback if window.open was blocked entirely
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }
};
