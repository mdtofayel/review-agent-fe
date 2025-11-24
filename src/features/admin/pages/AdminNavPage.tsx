import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { API } from "../../../api";
import type { NavCategory } from "../../../api/types";
import Layout from "../../../components/Layout";

type FormState = {
  id?: number;
  name: string;
  slug: string;
  path: string;
  icon: string;
  parentId: number | null;
  visible: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  path: "",
  icon: "",
  parentId: null,
  visible: true,
};

export default function AdminNavPage() {
  const queryClient = useQueryClient();

  const { data: navTree, isLoading, isError } = useQuery<NavCategory[]>({
    queryKey: ["nav"],
    queryFn: () => API.getNav(),
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof API.createNavCategory>[0]) =>
      API.createNavCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nav"] });
      setForm(emptyForm);
      setSelectedId(null);
      setMode("create");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: {
      id: number;
      payload: Parameters<typeof API.updateNavCategory>[1];
    }) => API.updateNavCategory(args.id, args.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nav"] });
      setForm(emptyForm);
      setSelectedId(null);
      setMode("create");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => API.deleteNavCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nav"] });
      if (selectedId != null) {
        setSelectedId(null);
        setForm(emptyForm);
        setMode("create");
      }
    },
  });

  const rootOptions = useMemo(() => {
    if (!navTree) return [];
    return navTree.map((root) => ({
      id: root.id,
      name: root.name,
    }));
  }, [navTree]);

  const parentOptions = useMemo(() => {
    if (!rootOptions) return [];
    if (form.id == null) return rootOptions;
    return rootOptions.filter((r) => r.id !== form.id);
  }, [rootOptions, form.id]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((f) => ({
        ...f,
        [name]: target.checked,
      }));
      return;
    }

    if (name === "parentId") {
      const v = target.value === "" ? null : Number(target.value);
      setForm((f) => ({ ...f, parentId: v }));
      return;
    }

    setForm((f) => ({
      ...f,
      [name]: target.value,
    }));
  }

  function handleSelectForEdit(node: NavCategory) {
    setMode("edit");
    setSelectedId(node.id);
    setForm({
      id: node.id,
      name: node.name,
      slug: node.slug,
      path: node.path ?? "",
      icon: node.icon ?? "",
      parentId: null,
      visible: node.visible ?? true,
    });
  }

  function handleNewRoot() {
    setMode("create");
    setSelectedId(null);
    setForm({ ...emptyForm, parentId: null });
  }

  function handleNewChild(parent: NavCategory) {
    setMode("create");
    setSelectedId(null);
    setForm({ ...emptyForm, parentId: parent.id });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      path: form.path.trim() || null,
      icon: form.icon.trim() || null,
      parentId: form.parentId,
      visible: form.visible,
    };

    if (!payload.name || !payload.slug) {
      alert("Name and slug are required");
      return;
    }

    if (mode === "edit" && form.id != null) {
      updateMutation.mutate({ id: form.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this nav category and its children if any?")) return;
    deleteMutation.mutate(id);
  }

  function renderNode(node: NavCategory, level: number) {
    const children = node.children ?? [];

    return (
      <div key={node.id} className="mb-1">
        <div
          className="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-2"
          style={{ marginLeft: level * 16 }}
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">{node.name}</span>
            <span className="text-xs text-slate-500">
              slug: {node.slug}
              {node.path ? `   path: ${node.path}` : ""}
            </span>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              className="rounded bg-indigo-100 px-2 py-1 hover:bg-indigo-200"
              onClick={() => handleNewChild(node)}
            >
              New child
            </button>
            <button
              type="button"
              className="rounded bg-amber-100 px-2 py-1 hover:bg-amber-200"
              onClick={() => handleSelectForEdit(node)}
            >
              Edit
            </button>
            <button
              type="button"
              className="rounded bg-rose-100 px-2 py-1 hover:bg-rose-200"
              onClick={() => handleDelete(node.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {children.length > 0 &&
          children.map((child) => renderNode(child, level + 1))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Navigation categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Current tree</h2>
              <button
                type="button"
                className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                onClick={handleNewRoot}
              >
                New root category
              </button>
            </div>

            {isLoading && (
              <div className="text-sm text-slate-500">
                Loading navigation tree...
              </div>
            )}
            {isError && (
              <div className="text-sm text-red-600">
                Could not load navigation data. Check the api or logs.
              </div>
            )}

            {!isLoading && !isError && navTree && navTree.length === 0 && (
              <div className="text-sm text-slate-500">
                No navigation categories yet. Use the button above to create the
                first one.
              </div>
            )}

            {!isLoading && !isError && navTree && navTree.length > 0 && (
              <div className="space-y-1">
                {navTree.map((root) => renderNode(root, 0))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-medium mb-3">
              {mode === "create" ? "Create nav category" : "Edit nav category"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Best lists"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="best-lists"
                />
                <p className="text-xs text-slate-500">
                  Used in links and api queries. Keep it url friendly.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Path</label>
                <input
                  name="path"
                  value={form.path}
                  onChange={handleInputChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="/best"
                />
                <p className="text-xs text-slate-500">
                  Route that will open when a user clicks this item.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Icon name (optional)
                </label>
                <input
                  name="icon"
                  value={form.icon}
                  onChange={handleInputChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="headphones"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Parent category</label>
                <select
                  name="parentId"
                  value={form.parentId ?? ""}
                  onChange={handleInputChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">No parent (root)</option>
                  {parentOptions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-slate-500">
                  For a second level entry choose a root category as parent.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="visible"
                  name="visible"
                  type="checkbox"
                  checked={form.visible}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <label htmlFor="visible" className="text-sm">
                  Visible in navbar
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {mode === "create" ? "Create" : "Save changes"}
                </button>

                {mode === "edit" && (
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-3 py-2 text-sm"
                    onClick={handleNewRoot}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
