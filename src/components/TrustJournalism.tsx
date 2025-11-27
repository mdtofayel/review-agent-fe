// src/components/TrustJournalism.tsx
export default function TrustJournalism() {
  return (
    <section className="mt-12 border-t pt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3 md:items-start">
          {/* left column title and intro */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              Why trust our journalism?
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Founded in 2025, ReviewHub exists to give readers clear,
              independent and practical advice on what to buy.
            </p>
            <p className="text-sm text-gray-700">
              Our editors and reviewers test hundreds of products each year to
              help you find the best value for your money.
            </p>
          </div>

          {/* right column with two blocks */}
          <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  {/* clipboard icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M7 2a2 2 0 00-2 2H4a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-1a2 2 0 00-2-2H7z" />
                    <path d="M7 4a1 1 0 011-1h2a1 1 0 011 1H7z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold">
                  Editorial independence
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Our reviews are written by journalists who are free from sales
                targets or manufacturer influence. The editorial team decides
                which products we cover and what we say about them.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  {/* person icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M10 10a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M4 16a6 6 0 1112 0H4z" />
                  </svg>
                </span>
                <h3 className="text-base font-semibold">
                  Professional conduct
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                ReviewHub staff follow clear guidelines about accuracy,
                disclosure and fairness. When we make a mistake, we correct it
                and explain what changed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
