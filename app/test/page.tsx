export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          KelSun Ventures Portal - Test Page
        </h1>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Next.js:</span>
              <span className="text-green-600 font-medium">✓ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Tailwind CSS:</span>
              <span className="text-green-600 font-medium">✓ Working</span>
            </div>
            <div className="flex justify-between">
              <span>TypeScript:</span>
              <span className="text-green-600 font-medium">✓ Working</span>
            </div>
            <div className="flex justify-between">
              <span>Components:</span>
              <span className="text-green-600 font-medium">✓ Working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
