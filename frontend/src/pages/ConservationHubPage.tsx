import React from "react";

// Reusable card for stats
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}

export default function ConservationHubPage() {
  return (
    <main className="flex-1 p-6 space-y-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold">Your Journey to Water Wisdom</h1>
        <p className="text-gray-600 mt-2">
          Discover practical tips, engage in fun challenges, and track your
          progress towards a more sustainable water footprint. Every drop counts!
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Join a Challenge
        </button>
      </section>

      {/* Progress Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Your Conservation Progress
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Water Saved This Month" value="5000 Liters" />
          <StatCard title="Active Challenges" value={3} />
          <StatCard title="Eco-Points Earned" value={1500} />
        </div>
      </section>

      {/* Learn & Implement */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Learn & Implement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Water-Saving Tips */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="font-bold mb-2">Water-Saving Tips</h3>
            <ul className="space-y-2">
              <li className="p-3 bg-gray-50 rounded border">
                💧 <strong>Fix Leaky Faucets:</strong> A small drip can waste
                thousands of liters per month. Check and fix all leaks promptly.
              </li>
              <li className="p-3 bg-gray-50 rounded border">
                🚿 <strong>Shorten Showers:</strong> Reduce shower time by a few
                minutes to save significant water daily.
              </li>
              <li className="p-3 bg-gray-50 rounded border">
                🌧️ <strong>Harvest Rainwater:</strong> Install a system to
                collect rainwater for gardening and non-potable uses.
              </li>
              <li className="p-3 bg-gray-50 rounded border">
                ⚡ <strong>Efficient Appliances:</strong> Upgrade to
                water-efficient washing machines and dishwashers for
                long-term savings.
              </li>
            </ul>
          </div>

          {/* Articles / Learning Resources */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">
                Monsoon Harvest: Rainwater Harvesting Basics
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Learn how to collect and utilize rainwater during the monsoon to
                reduce dependency on municipal water.
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm">
                Read More
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="font-semibold">
                Smart Gardening: Water-Wise Landscaping
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Explore drought-resistant plants and efficient irrigation
                techniques to create a sustainable, low-water garden.
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Engage & Transform */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Engage & Transform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">No Drip Day</h4>
            <p className="text-gray-600 text-sm mt-1">
              Can you go a full day without leaks or unnecessary water drips?
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm w-full">
              View Challenge
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">Garden Smart Week</h4>
            <p className="text-gray-600 text-sm mt-1">
              Implement 3 water-saving techniques in your garden this week.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm w-full">
              View Challenge
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">Water Audit Week</h4>
            <p className="text-gray-600 text-sm mt-1">
              Track household water usage for a week and identify areas for
              reduction.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
            </div>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm w-full">
              View Challenge
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
