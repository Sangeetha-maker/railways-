export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Next.js!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Docs</h2>
            <p className="text-gray-600">
              Find in-depth information about Next.js features and API.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Learn</h2>
            <p className="text-gray-600">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Templates</h2>
            <p className="text-gray-600">
              Explore starter templates for Next.js.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}