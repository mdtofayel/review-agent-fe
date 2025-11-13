import { useEffect } from "react";

export default function SEO({ title, description }: { title?: string; description?: string }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null; // no UI
}
