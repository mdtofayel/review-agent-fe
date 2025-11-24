import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "../../../components/Layout";
import { API } from "../../../api";
import type { JobLog, ScrapeJob, RawProduct } from "../../../api/types";
import { useEffect, useRef } from "react";

export default function JobDetail() {
  const { id = "" } = useParams();
  const qc = useQueryClient();

  // load job info
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

  useEffect(() => {
    if (!logs.data?.length) return;
    qc.setQueryData<JobLog[]>(["logs-accu", id], (prev = []) => [...prev, ...logs.data!]);
  }, [logs.data, id, qc]);

  const accu = qc.getQueryData<JobLog[]>(["logs-accu", id]) ?? [];

  // base url for image paths from backend
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // load raw products for this job
  const rawProducts = useQuery({
    queryKey: ["raw-products", id],
    queryFn: () => API.getRawProductsForJob(id),
    enabled: job.data?.status === "SUCCEEDED",
  });

  // now we can safely return based on job state
  if (job.isLoading) {
    return (
      <Layout>
        <div className="p-4">Loading…</div>
      </Layout>
    );
  }

  if (job.isError || !job.data) {
    return (
      <Layout>
        <div className="p-4">Job not found.</div>
      </Layout>
    );
  }

  const j: ScrapeJob = job.data;

  return (
    <Layout>
      <div className="mb-3 text-sm">
        <Link to="/admin" className="text-blue-600 hover:underline">
          ← Back to jobs
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-2">Job {j.id}</h1>
      <p className="text-gray-600 mb-4">
        Keyword: <span className="font-medium">{j.keyword}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-medium mb-2">Status</h3>
          <div className="text-sm">
            <div>
              <b>State:</b> {j.status}
            </div>
            {j.startedAt && (
              <div>
                <b>Started:</b> {new Date(j.startedAt).toLocaleTimeString()}
              </div>
            )}
            {j.endedAt && (
              <div>
                <b>Ended:</b> {new Date(j.endedAt).toLocaleTimeString()}
              </div>
            )}
            {j.errorMsg && (
              <div className="text-rose-700">
                <b>Error:</b> {j.errorMsg}
              </div>
            )}
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

      <div className="mt-8">
        <h3 className="font-medium mb-2">Raw products</h3>

        {j.status !== "SUCCEEDED" && (
          <p className="text-sm text-gray-500">
            Raw products will be available when the job has succeeded.
          </p>
        )}

        {j.status === "SUCCEEDED" && (
          <>
            {rawProducts.isLoading && (
              <p className="text-sm text-gray-500">Loading raw products…</p>
            )}

            {rawProducts.isError && (
              <p className="text-sm text-rose-600">Failed to load raw products.</p>
            )}

            {rawProducts.data && rawProducts.data.length === 0 && (
              <p className="text-sm text-gray-500">No raw products found for this job.</p>
            )}

            {rawProducts.data && rawProducts.data.length > 0 && (
              <div className="mt-2 overflow-x-auto rounded-2xl border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Image</th>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Rating</th>
                      <th className="px-3 py-2">Reviews</th>
                      <th className="px-3 py-2">Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawProducts.data.map((p: RawProduct, idx: number) => {
                      // images are saved under backend project root, for example
                      // productImages/<jobId>/product_1.jpg
                      // and the value in imageUrl is that relative path
                      const src =
                        p.imageUrl && p.imageUrl.startsWith("http")
                          ? p.imageUrl
                          : p.imageUrl
                          ? `${apiBase}/${p.imageUrl.replace(/\\/g, "/")}`
                          : null;

                      return (
                        <tr key={p.id} className={idx % 2 === 1 ? "bg-gray-50" : ""}>
                          <td className="px-3 py-2 align-middle">{idx + 1}</td>
                          <td className="px-3 py-2 align-middle">
                            {src ? (
                              <img
                                src={src}
                                alt={p.title || "Product image"}
                                className="h-12 w-12 object-contain rounded border"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">No image</span>
                            )}
                          </td>
                          <td className="px-3 py-2 align-middle">{p.title}</td>
                          <td className="px-3 py-2 align-middle">{p.priceRaw}</td>
                          <td className="px-3 py-2 align-middle">{p.ratingRaw}</td>
                          <td className="px-3 py-2 align-middle">{p.reviewsRaw}</td>
                          <td className="px-3 py-2 align-middle">{p.availability}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
