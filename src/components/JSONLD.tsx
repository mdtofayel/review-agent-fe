export default function JSONLD({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Safe because we fully control the object we pass in
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
