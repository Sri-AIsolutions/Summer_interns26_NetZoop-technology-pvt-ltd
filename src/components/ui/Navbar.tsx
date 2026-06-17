'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Course Browser
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/search"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
