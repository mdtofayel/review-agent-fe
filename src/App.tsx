import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./features/home/Home";
import Search from "./features/search/Search";
import ProductDetail from "./features/product/ProductDetail";
import RoundupPage from "./features/roundup/RoundupPage";
import { BestListsPage } from "./features/roundup/BestListsPage";

import AdminDashboard from "./features/admin/pages/AdminDashboard";
import JobDetail from "./features/admin/pages/JobDetail";
import AdminNavPage from "./features/admin/pages/AdminNavPage";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/p/:slug" element={<ProductDetail />} />
          <Route path="/best/:slug" element={<RoundupPage />} />
           <Route path="/best" element={<BestListsPage />} />
          {/* admin pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/jobs/:id" element={<JobDetail />} />
          <Route path="/admin/nav" element={<AdminNavPage />} />

          {/* fallback */}
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
