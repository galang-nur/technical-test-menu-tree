import Link from "next/link"

export function ErrorState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
        <p className="text-gray-600 mb-4">Failed to connect to the backend API.</p>
        <div className="space-y-2">
          <button
            onClick={() => window.location.reload()}
            className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <Link href="/" className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Back to Tree View
          </Link>
        </div>
      </div>
    </div>
  )
}