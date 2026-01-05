'use client'

export function Footer() {
  return (
    <footer className="mt-16 py-12 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-t-2 border-purple-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Purpose of this site 💬💕
          </h2>
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to our shared lightweight Notion-style database tracker! 📚✨ 
              This collaborative workspace is designed for <strong>David and Daniel</strong> to manage 
              projects, tasks, and ideas together.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Key Features:</strong>
            </p>
            <ul className="text-gray-700 space-y-2 mb-4">
              <li>✨ <strong>Dynamic Columns:</strong> Add, edit, reorder, and customize column types (text, numbers, dates, selects, checkboxes, URLs, and more)</li>
              <li>🧩 <strong>Collaborative Editing:</strong> Both users can add, edit, and delete rows in real-time</li>
              <li>💾 <strong>Persistent Storage:</strong> All data is stored in a PostgreSQL database and persists through redeploys - no data loss!</li>
              <li>🔍 <strong>Search & Filter:</strong> Quickly find what you're looking for with powerful search and filter capabilities</li>
              <li>📱 <strong>Mobile Friendly:</strong> Responsive design that works beautifully on desktop and mobile devices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This is a private shared workspace where we can track projects, manage priorities, 
              set due dates, and stay organized together. The database structure is flexible and 
              grows with our needs! 🚀
            </p>
            <p className="text-gray-600 text-sm mt-6 pt-4 border-t border-gray-200">
              Built with Next.js, TypeScript, Prisma, and lots of ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

