import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { API } from "../../../api";
import type { ScrapeJob } from "../../../api/types";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] =
    useState<"" | "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED">("");

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", status],
    queryFn: () =>
      API.listScrapeJobs({
        page: 1,
        size: 10,
        status: (status || undefined) as any,
      }),
    refetchInterval: 2000,
  });

  const create = useMutation({
    mutationFn: API.createScrapeJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    create.mutate({ keyword: keyword.trim(), depth: 20 });
    setKeyword("");
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Enter keyword e.g. iphone 15 case"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4 py-2" disabled={create.isPending}>
          {create.isPending ? "Running…" : "Run"}
        </button>
      </form>

      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Recent jobs</h2>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="RUNNING">Running</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-4 [&>th]:py-2 text-left text-gray-600">
              <th>Keyword</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : data?.items?.length ? (
              data.items.map((j: ScrapeJob) => (
                <tr key={j.id} className="border-t">
                  <td className="px-4 py-3">{j.keyword}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(j.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link className="text-blue-600 hover:underline" to={`/jobs/${j.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-gray-500">
                  No jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: ScrapeJob["status"] }) {
  const map: Record<ScrapeJob["status"], string> = {
    PENDING: "bg-gray-100 text-gray-800 border-gray-200",
    RUNNING: "bg-blue-50 text-blue-700 border-blue-200",
    SUCCEEDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
}
