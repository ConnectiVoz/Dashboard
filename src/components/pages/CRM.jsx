import React from "react";

const CRMs = [
  {
    name: "Salesforce",
    connected: false,
    logo: "https://www.salesforce.com/favicon.ico",
    description: "Sync CRM activities with Google Calendar for seamless scheduling",
  },
  {
    name: "Zoho",
    connected: true,
    logo: "https://www.zoho.com/sites/zweb/images/favicon.ico",
    description: "Elevate your CRM capabilities with Zoho CRM seamless integration",
  },
  {
    name: "HubSpot",
    connected: false,
    logo: "data:image/png;base64,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",
    description: "Automate routines and maximize your sales team’s productivity.",
  },
];

const CRM = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#fbc2eb]">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6366f1]/80 via-[#a18cd1]/70 to-[#fbc2eb]/70 backdrop-blur-md border-b border-white/30 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="bg-gradient-to-tr from-[#6366f1] to-[#a18cd1] p-2 rounded-full shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          </span>
          <div>
            <span className="font-semibold text-gray-800">Vanshika</span>
            <br />
            <span className="text-gray-100 text-sm">+91 123 000 0000</span>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex">
        {/* Left-side panel */}
        <aside className="bg-gradient-to-b from-[#e0e7ff]/80 via-white/60 to-[#fbc2eb]/70 backdrop-blur-md p-6 w-64 min-h-[calc(100vh-64px)] border-r border-white/30 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Connect CRM</h2>
          <button className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white p-2 rounded font-semibold w-full shadow hover:scale-105 transition">
            Add CRM +
          </button>
          <ul className="mt-4 space-y-2">
            {CRMs.map((crm, index) => (
              <li key={index} className="p-2 rounded hover:bg-blue-100/40 text-gray-700 font-medium transition">
                {crm.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-semibold mb-4 text-gray-800 drop-shadow">Integrations</h1>
          <p className="text-gray-600 mb-6">
            Seamlessly connect and synchronize your CRM with other essential tools and platforms.
          </p>

          {/* CRM cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CRMs.map((crm, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/80 via-[#e0e7ff]/80 to-[#fbc2eb]/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/40 transform hover:-translate-y-1 hover:shadow-2xl transition duration-300"
              >
                <div className="w-14 h-14 rounded-full mb-4 shadow-lg flex items-center justify-center bg-gradient-to-tr from-[#6366f1] to-[#a18cd1]">
                  <img src={crm.logo} alt={crm.name} className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{crm.name}</h2>
                <p className="text-gray-600 mb-4">{crm.description}</p>
                <button
                  className={`${
                    crm.connected
                      ? "bg-gradient-to-tr from-green-400 to-green-600"
                      : "bg-gradient-to-tr from-blue-400 to-purple-500"
                  } text-white p-2 rounded font-semibold shadow hover:scale-105 transition duration-300`}
                >
                  {crm.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>

          <div className="text-blue-500 mt-6 font-semibold">More...</div>
        </main>
      </div>

      {/* Note */}
      <div className="p-4 border-t border-white/30 bg-gradient-to-r from-[#e0e7ff]/60 via-white/60 to-[#fbc2eb]/60 backdrop-blur-md text-gray-700 text-center">
        <p>
          <span className="font-semibold">Note:</span> Currently we are focusing on Zoho; other services will be disabled. Hover to view future plans.
        </p>
      </div>
    </div>
  );
};

export default CRM;