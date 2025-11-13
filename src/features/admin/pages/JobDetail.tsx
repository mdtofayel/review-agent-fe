import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { API } from "../../../api";
import type { JobLog, ScrapeJob } from "../../../api/types";
import { useEffect, useRef } from "react";

export default function JobDetail() {
  const { id = "" } = useParams();
  const qc = useQueryClient();

  const job = useQuery({
    queryKey: ["job", id],
    queryFn: () => API.getScrapeJob(id),
    refetchInterval: 2000,
  });

  // incremental logs
  const lastTsRef = useRef<string | undefined>(undefined);
  const logs = useQuery({
    queryKey: ["joblogs", id],
    queryFn: async () => {
      const res = await API.getJobLogs(id, lastTsRef.current);
      if (res.length) lastTsRef.current = res[res.length - 1].ts;
      return res;
    },
    refetchInterval: 1200,
  });

  // accumulate logs into cache key ["logs-accu", id]
  useEffect(() => {
    if (!logs.data?.length) return;
    qc.setQueryData<JobLog[]>(["logs-accu", id], (prev = []) => [...prev, ...logs.data!]);
  }, [logs.data, id, qc]);

  const accu = (qc.getQueryData<JobLog[]>(["logs-accu", id]) ?? []);

  if (job.isLoading) return <Layout><div className="p-4">Loading…</div></Layout>;
  if (job.isError || !job.data) return <Layout><div className="p-4">Job not found.</div></Layout>;

  const j: ScrapeJob = job.data;

  return (
    <Layout>
      <div className="mb-3 text-sm">
        <Link to="/admin" className="text-blue-600 hover:underline">← Back to jobs</Link>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Job {j.id}</h1>
      <p className="text-gray-600 mb-4">
        Keyword: <span className="font-medium">{j.keyword}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-medium mb-2">Status</h3>
          <div className="text-sm">
            <div><b>State:</b> {j.status}</div>
            {j.startedAt && <div><b>Started:</b> {new Date(j.startedAt).toLocaleTimeString()}</div>}
            {j.endedAt && <div><b>Ended:</b> {new Date(j.endedAt).toLocaleTimeString()}</div>}
            {j.errorMsg && <div className="text-rose-700"><b>Error:</b> {j.errorMsg}</div>}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-medium mb-2">Live logs</h3>
          <div className="h-64 overflow-auto font-mono text-xs border rounded p-2 bg-gray-50">
            {accu.length === 0 ? (
              <div className="text-gray-500">Waiting for logs…</div>
            ) : (
              accu.map((l, i) => (
                <div key={i} className="whitespace-pre">
                  [{new Date(l.ts).toLocaleTimeString()}] {l.level.padEnd(5)} — {l.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
