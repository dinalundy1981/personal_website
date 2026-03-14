import { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { uploadToImgBB } from "@/lib/imgbb";
import { ArrowLeft, Save } from "lucide-react";

interface BlogEditorProps {
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

const BlogEditor = ({ initialData, onSave, onCancel }: BlogEditorProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "Dr. Dina Lundy");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadToImgBB(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
        }
      } catch {
        alert("Image upload failed. Please try again.");
      }
    };
  };

  const videoHandler = () => {
    const url = prompt("Enter video URL (YouTube, Vimeo, etc.):");
    if (!url) return;
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "video", url);
      quill.setSelection(range.index + 1);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "color", "background", "list", "align",
    "blockquote", "code-block", "link", "image", "video",
  ];

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      title,
      author,
      excerpt,
      image_url: imageUrl || null,
      content,
      published_at: initialData?.published_at || new Date().toISOString(),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="font-heading text-2xl text-primary">
          {initialData ? "Edit Blog Post" : "New Blog Post"}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog post title" />
        </div>
        <div>
          <Label>Author</Label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
        </div>
      </div>

      <div>
        <Label>Short Description / Excerpt</Label>
        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary shown on the blog card..." rows={2} />
      </div>

      <ImageUploadField label="Cover Image" value={imageUrl} onChange={setImageUrl} />
      {imageUrl && (
        <div className="w-48 rounded-lg overflow-hidden border">
          <img src={imageUrl} alt="Cover preview" className="w-full h-auto" />
        </div>
      )}

      <div>
        <Label className="mb-2 block">Blog Content</Label>
        <div className="border rounded-lg overflow-hidden bg-background [&_.ql-toolbar]:bg-muted/50 [&_.ql-container]:min-h-[300px] [&_.ql-editor]:min-h-[300px] [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:rounded-lg [&_.ql-editor_img]:my-4 [&_.ql-editor_.ql-video]:w-full [&_.ql-editor_.ql-video]:aspect-video [&_.ql-editor_.ql-video]:rounded-lg [&_.ql-editor_.ql-video]:my-4">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your blog content here... Use the toolbar to add images and videos."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving || !title.trim()}>
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Blog Post"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default BlogEditor;
