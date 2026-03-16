import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-gray-600 dark:text-gray-400">Page not found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFound
