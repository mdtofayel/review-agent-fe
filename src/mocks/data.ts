import type { Product } from "../api/types";

const now = () => new Date().toISOString();

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 36 }).map((_, i) => {
  const slug = `sample-product-${i+1}`;
  const price = 19 + (i % 10) * 5;
  const rating = 3 + ((i * 7) % 21) / 10; // 3.0 .. 5.0
  const category = ["Phones", "Laptops", "Audio", "Wearables"][i % 4];
  return {
    id: `${i+1}`,
    slug,
    title: `Sample Product ${i+1}`,
    brand: ["Acme", "Globex", "Soylent", "Initech"][i % 4],
    price,
    currency: "€",
    image: `https://picsum.photos/seed/${slug}/600/400`,
    rating: Math.min(5, Math.round(rating * 10)/10),
    votes: 50 + (i * 13) % 200,
    highlight: "Excellent battery life and solid build quality.",
    badges: i % 7 === 0 ? ["Best Value"] : undefined,
    specs: { Weight: `${150 + i} g`, Color: ["Black","Silver","Blue"][i % 3], Warranty: "2 years" },
    review: {
      summary: "A balanced pick for most buyers.",
      pros: ["Battery life", "Display", "Price"],
      cons: ["Average camera in low light", "Limited color options"],
      body_md:
        "## Verdict\nA dependable choice with strong fundamentals. " +
        "If you value battery and display over camera, this is for you.\n\n" +
        "### Performance\nSnappy for daily tasks, casual gaming is fine.",
      author: "Editorial Team",
      updatedAt: now(),
    },
    seo: {
      metaTitle: `Review: Sample Product ${i+1}`,
      metaDescription: "Read our hands-on review with pros/cons and verdict.",
    },
    createdAt: now(),
    category,
  };
});
