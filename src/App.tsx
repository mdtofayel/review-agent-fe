// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./features/home/Home";
import Search from "./features/search/Search";
import ProductDetail from "./features/product/ProductDetail";
import RoundupPage from "./features/roundup/RoundupPage";
import { BestListsPage } from "./features/roundup/BestListsPage";
import DealsPage from "./features/deals/DealsPage";

import AdminDashboard from "./features/admin/pages/AdminDashboard";
import JobDetail from "./features/admin/pages/JobDetail";
import AdminNavPage from "./features/admin/pages/AdminNavPage";

import ContentListPage from "./features/common/ContentListPage";
import NotFoundPage from "./features/common/NotFoundPage";

// new full single review page
import SingleReview from "./features/singleReview/SingleReview";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* old simple product detail route (keep if you still use it) */}
          <Route path="/p/:slug" element={<ProductDetail />} />

          {/* new full single product review route */}
          <Route path="/products/:slug" element={<SingleReview />} />

          {/* deals detail page */}
          <Route path="/deals/:slug" element={<DealsPage />} />

          {/* best list overview */}
          <Route path="/best" element={<BestListsPage />} />

          {/* roundup detail pages */}
          <Route path="/best/:slug" element={<RoundupPage />} />
          <Route path="/roundups/:slug" element={<RoundupPage />} />

          {/* optional direct access to list page */}
          <Route path="/list" element={<ContentListPage />} />

          {/* generic list pages driven by admin nav, for example /news, /versus */}
          <Route path="/:section" element={<ContentListPage />} />

          {/* admin pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/jobs/:id" element={<JobDetail />} />
          <Route path="/admin/nav" element={<AdminNavPage />} />

          {/* fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
