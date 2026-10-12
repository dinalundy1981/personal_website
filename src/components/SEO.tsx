import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SEOProps) => {
  useEffect(() => {
    const siteTitle = "Dr. Dina Lundy | Psychology Scholar & Researcher";
    const defaultDesc = "Dr. Dina Lundy is the Associate Director of Undergraduate Psychology and a leading authority on the lasting effects of chattel slavery on poverty and the contemporary structure of the Black family.";
    const defaultKeywords = "Dr Dina Lundy, Dina Lundy psychologist, Black family studies researcher, chattel slavery poverty research, psychology professor Dina Lundy";
    const defaultUrl = "https://dinalundy.com";
    const defaultImage = "https://dinalundy.com/dina-portrait.jpg";

    // Update Title
    document.title = title ? `${title} | Dr. Dina Lundy` : siteTitle;

    // Update Meta Tags Helper
    const setMetaTag = (attr: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attr, value);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Update Link Tag Helper
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (element) {
        element.setAttribute("href", href);
      } else {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        element.setAttribute("href", href);
        document.head.appendChild(element);
      }
    };

    // Update description, keywords
    setMetaTag("name", "description", description || defaultDesc);
    setMetaTag("name", "keywords", keywords || defaultKeywords);

    // Update Canonical
    const currentUrl = ogUrl || window.location.href;
    setLinkTag("canonical", canonical || currentUrl);

    // Update Open Graph (og:) tags
    setMetaTag("property", "og:title", ogTitle || title || siteTitle);
    setMetaTag("property", "og:description", ogDescription || description || defaultDesc);
    setMetaTag("property", "og:image", ogImage || defaultImage);
    setMetaTag("property", "og:url", ogUrl || currentUrl);

    // Update Twitter Card tags
    setMetaTag("name", "twitter:title", twitterTitle || title || siteTitle);
    setMetaTag("name", "twitter:description", twitterDescription || description || defaultDesc);
    setMetaTag("name", "twitter:image", twitterImage || ogImage || defaultImage);

  }, [
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);

  return null;
};

export default SEO;
