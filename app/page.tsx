export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FinAppV3</h1>
          <p className="text-gray-600 mt-2">Financial Planning & Modeling</p>
        </header>

        <main>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-700 mb-6">
              Create your financial model by answering a few questions about your income,
              expenses, and financial goals.
            </p>

            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Start Questionnaire
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
