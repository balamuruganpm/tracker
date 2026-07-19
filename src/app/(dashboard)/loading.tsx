'use strict'

export default function Loading() {
  return (
    <div className="w-full space-y-6 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-neutral-200"></div>
          <div className="h-4 w-64 rounded-lg bg-neutral-100"></div>
        </div>
        <div className="h-10 w-32 rounded-xl bg-neutral-200"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between space-x-4">
              <div className="h-4 w-20 rounded bg-neutral-200"></div>
              <div className="h-8 w-8 rounded-full bg-neutral-100"></div>
            </div>
            <div className="mt-4 h-8 w-24 rounded bg-neutral-200"></div>
            <div className="mt-2 h-3 w-32 rounded bg-neutral-100"></div>
          </div>
        ))}
      </div>

      {/* Large Content Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm h-96">
          <div className="h-6 w-32 rounded bg-neutral-200 mb-6"></div>
          <div className="w-full h-72 rounded bg-neutral-50"></div>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm h-96">
          <div className="h-6 w-32 rounded bg-neutral-200 mb-6"></div>
          <div className="w-full h-72 rounded bg-neutral-50"></div>
        </div>
      </div>
    </div>
  )
}
