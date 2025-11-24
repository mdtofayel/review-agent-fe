import { useMemo, useState } from "react";
import type React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { API } from "../../../api";
import type { ScrapeJob, JobStatus } from "../../../api/types";

type JobsResp = { items: ScrapeJob[]; page: number; size: number; total: number };

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [sp, setSp] = useSearchParams();

  const page = Number(sp.get("page") || "1");
  const status = (sp.get("status") as JobStatus | null) || null;

  const jobsQ = useQuery<JobsResp>({
    queryKey: ["jobs", page, status],
    queryFn: () =>
      API.listScrapeJobs({
        page: page > 0 ? page - 1 : 0,
        size: PAGE_SIZE,
        status: status ?? undefined,
      }),
    refetchInterval: 2000,
  });

  const [keyword, setKeyword] = useState("");
  const [market, setMarket] = useState("");
  const [depth, setDepth] = useState<number | undefined>(20);

  const createM = useMutation({
    mutationFn: () =>
      API.createScrapeJob({ keyword, market: market || undefined, depth }),
    onSuccess: () => {
      setKeyword("");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  function setPage(p: number) {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next, { replace: true });
  }

  function setStatusFilter(s: JobStatus | "ALL") {
    const next = new URLSearchParams(sp);
    if (s === "ALL") next.delete("status");
    else next.set("status", s);
    next.set("page", "1");
    setSp(next, { replace: true });
  }

  const totalPages = useMemo(() => {
    const t = jobsQ.data?.total ?? 0;
    return Math.max(1, Math.ceil(t / PAGE_SIZE));
  }, [jobsQ.data]);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* top admin header with link to nav page */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin dashboard</h1>
          <div className="flex gap-2">
            <Link
              to="/admin/nav"
              className="rounded px-3 py-2 bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Manage navigation
            </Link>
          </div>
        </div>

        {/* create job */}
        <section className="rounded-2xl border bg-white p-4">
          <h2 className="text-lg font-semibold mb-3">Start new scrape</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="border rounded px-3 py-2 w-full md:w-1/2"
              placeholder="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2 w-full md:w-1/4"
              placeholder="market (optional)"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2 w-full md:w-24"
              type="number"
              min={1}
              placeholder="depth"
              value={depth ?? 20}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
            <button
              onClick={() => createM.mutate()}
              disabled={!keyword || createM.isPending}
              className="rounded px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
            >
              {createM.isPending ? "Starting..." : "Start"}
            </button>
          </div>
          {createM.isError && (
            <p className="text-rose-700 text-sm mt-2">Could not start job.</p>
          )}
        </section>

        {/* jobs table */}
        <section className="rounded-2xl border bg-white p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Jobs</h2>
            <div className="flex items-center gap-2">
              <StatusButton
                label="All"
                active={!status}
                onClick={() => setStatusFilter("ALL")}
              />
              <StatusButton
                label="Pending"
                active={status === "PENDING"}
                onClick={() => setStatusFilter("PENDING")}
              />
              <StatusButton
                label="Running"
                active={status === "RUNNING"}
                onClick={() => setStatusFilter("RUNNING")}
              />
              <StatusButton
                label="Succeeded"
                active={status === "SUCCEEDED"}
                onClick={() => setStatusFilter("SUCCEEDED")}
              />
              <StatusButton
                label="Failed"
                active={status === "FAILED"}
                onClick={() => setStatusFilter("FAILED")}
              />
            </div>
          </div>

          {jobsQ.isLoading ? (
            <div className="p-4">Loading…</div>
          ) : jobsQ.isError ? (
            <div className="p-4 text-rose-700">Could not load jobs.</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <Th>Id</Th>
                    <Th>Keyword</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                    <Th>Started</Th>
                    <Th>Ended</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobsQ.data?.items.map((j) => (
                    <tr key={j.id} className="hover:bg-gray-50">
                      <Td className="font-mono">{j.id}</Td>
                      <Td>{j.keyword}</Td>
                      <Td>
                        <StatusPill status={j.status} />
                      </Td>
                      <Td>{new Date(j.createdAt).toLocaleString()}</Td>
                      <Td>
                        {j.startedAt
                          ? new Date(j.startedAt).toLocaleString()
                          : "-"}
                      </Td>
                      <Td>
                        {j.endedAt
                          ? new Date(j.endedAt).toLocaleString()
                          : "-"}
                      </Td>
                      <Td>
                        <Link
                          to={`/admin/jobs/${j.id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </Link>
                      </Td>
                    </tr>
                  ))}
                  {jobsQ.data && jobsQ.data.items.length === 0 && (
                    <tr>
                      <Td
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No jobs
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t">
                <button
                  className="px-3 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <div className="text-sm">
                  Page {page} of {totalPages}
                </div>
                <button
                  className="px-3 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-4 py-2 font-medium ${props.className ?? ""}`}
    />
  );
}

function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props} className={`px-4 py-2 ${props.className ?? ""}`} />
  );
}

function StatusButton(props: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const { label, active, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded border ${
        active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, string> = {
    PENDING: "bg-gray-200 text-gray-800",
    RUNNING: "bg-amber-200 text-amber-900",
    SUCCEEDED: "bg-emerald-200 text-emerald-900",
    FAILED: "bg-rose-200 text-rose-900",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded ${styles[status]}`}>
      {status}
    </span>
  );
}
