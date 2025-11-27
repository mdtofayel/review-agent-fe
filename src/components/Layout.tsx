import type { PropsWithChildren } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* main content container */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

      <footer className="mt-12 bg-indigo-700 text-indigo-50">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex items-center gap-2">
          <span>© {new Date().getFullYear()}</span>
          <span className="font-semibold">ReviewHub</span>
          <span>•</span>
          <a className="underline hover:text-white" href="#">
            How we test
          </a>
        </div>
      </footer>
    </div>
  );
}
