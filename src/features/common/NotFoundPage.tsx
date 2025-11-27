// src/features/common/NotFoundPage.tsx
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2
                     text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go back home
        </Link>
      </div>
    </Layout>
  );
}
