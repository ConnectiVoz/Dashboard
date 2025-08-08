import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaChartPie, FaWallet } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { SiGoogleanalytics } from "react-icons/si";
import CircleProgress from "./CircleProgress";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({ first_name: "", phone_number: "" });
  const [amountSpent, setAmountSpent] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [agents, setAgents] = useState([]);
  const [callsToday, setCallsToday] = useState(0);
  const [pendingCalls, setPendingCalls] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalCampaignsCount, setTotalCampaignsCount] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");
      const response = await fetchWithAuth("https://3.95.238.222/api/homepage/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      const json = JSON.parse(text);
      setData(json);
      setError(null);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err.message);
      toast.error("Failed to fetch dashboard data.");
      setError("Something went wrong while loading dashboard data.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmountSpent = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://3.95.238.222/api/user/amount-spent/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        setAmountSpent(result.amount);
      }
    } catch (err) {
      // console.error("❌ Amount fetch error:", err);
    }
  };

  const fetchAgents = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://3.95.238.222/api/bots/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (Array.isArray(result)) {
        setAgents(result);
      } else if (result.bots) {
        setAgents(result.bots);
      } else {
        setAgents([]);
      }
    } catch (err) {
      console.error("❌ Agents fetch error:", err);
      toast.error("Failed to fetch agents.");
    }
  };

  const fetchUserProfile = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://3.95.238.222/api/user/user-profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData({ first_name: data.first_name || "User" });
      } else {
        toast.error("Failed to load user profile.");
      }
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      toast.error("Error fetching user profile.");
    }
  };

  // 🆕 New: Fetch call logs to get callsToday, pendingCalls, totalCalls
  const fetchCallLogsForStats = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      const res = await fetch("https://3.95.238.222/api/call-logs/list", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch call logs");

      const data = await res.json();
      const logs = Array.isArray(data) ? data : data.data || [];

      const today = new Date().toISOString().slice(0, 10);

      setTotalCalls(logs.length);
      setCallsToday(logs.filter(log => log.call_date && log.call_date.startsWith(today)).length);
      setPendingCalls(logs.filter(log => log.status === "Pending").length);
    } catch (err) {
      console.error("Error fetching call logs for stats:", err);
    }
  };

  const fetchCampaignsCount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://3.95.238.222/api/campaigns/list", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch campaigns");

      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setTotalCampaignsCount(list.length);
    } catch (err) {
      console.error("Error fetching campaigns count:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAgents();
    fetchAmountSpent();
    fetchUserProfile();
    fetchCallLogsForStats();
    fetchCampaignsCount();
  }, []);

  const handleCalendarChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    if (selected) {
      navigate(`/reports/calling?date=${selected}`);
    }
  };

  const handleBlockedClick = (e) => {
    e.preventDefault();
    toast.info("🚫 This page is currently unavailable.");
  };

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {Array(6)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-white/10 rounded-2xl p-4 h-24 shadow-md"
            ></div>
          ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">{error}</div>
    );

  return (
    <div className="p-4 bg-gray-100 dark:bg-[#121212] min-h-screen transition-colors duration-300">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {new Date().toDateString()}
      </p>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome back, {userData?.first_name || "User"} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Account Balance - Disabled */}
        <div onClick={handleBlockedClick}>
          <StatCard
            icon={<FaMoneyBillWave />}
            label="Account Balance"
            value={`₹${data?.accountBalance || 0}`}
          />
        </div>

        {/* Amount Spent - Disabled */}
        <div onClick={handleBlockedClick}>
          <StatCard icon={<FaWallet />} label="Amount Spent" value={`₹${amountSpent || 0}`}>
            <div className="-mt-14 ml-48">
              <input
                type="date"
                className="text-xs p-0 rounded bg-white dark:bg-gray-700 dark:text-white cursor-pointer"
                onChange={handleCalendarChange}
              />
            </div>
          </StatCard>
        </div>

        <NavLink to="/call-logs">
          <StatCard icon={<FaChartPie />} label="Total Calls" value={totalCalls} />
        </NavLink>
        <NavLink to="/call-logs">
          <StatCard icon={<MdPendingActions />} label="Pending Calls" value={pendingCalls} />
        </NavLink>
        <NavLink to="/call-logs">
          <StatCard
            icon={<BsFillTelephonePlusFill />}
            label="Calls Today"
            value={callsToday}
          />
        </NavLink>
        <NavLink to="/campaign">
          <StatCard
            icon={<SiGoogleanalytics />}
            label=" Running Campaigns"
            value={data?.campaigns?.filter((c) => c.status === "running").length || 0}
          />
        </NavLink>
      </div>

      {/* === Analytics Section === */}
      <div className="mt-12">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnalyticsCard label="Total Campaign" value={totalCampaignsCount} link="/campaign" emoji="📊" />
          <AnalyticsCard
            label="Running Campaign"
            value={data?.campaigns?.filter((c) => c.status === "running").length || 0}
            link="/campaign"
            emoji="✅"
          />
          <AnalyticsCard label="Total Agents" value={agents.length} link="/manage/agents" emoji="🤖" />
        </div>
      </div>

      {/* === Agents Section === */}
      {agents.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-white-800 dark:text-white mb-4">
            Your Agents
          </h2>
          <div className="grid text-white sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.slice(0, 3).map((agent, i) => {
              const completed = agent.completed || Math.floor(Math.random() * 10) + 1;
              const total = agent.total || 10;
              const percentage = ((completed / total) * 100).toFixed(0);
              return (
                <div
                  key={agent.id || i}
                  className="p-4 rounded-xl bg-white dark:bg-white/10 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-1">
                    {agent.bot_name || "Agent"}
                  </h3>
                  <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {completed} / {total}
                  </p>
                </div>
              );
            })}
          </div>
          {agents.length > 3 && (
            <div className="mt-4 text-center">
              <NavLink
                to="/manage/agents"
                className="text-blue-600 dark:text-blue-400 text-sm underline hover:text-blue-800 dark:hover:text-blue-300"
              >
                More
              </NavLink>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 text-gray-500 dark:text-gray-400 text-center">No agents found.</div>
      )}

      {/* === Recent Activities === */}
      <div className="mt-12">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activities
        </h2>
        <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
          {data?.recentActivities?.length > 0 ? (
            data.recentActivities.map((activity, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="text-sm text-gray-600 dark:text-gray-300">{activity}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="cursor-pointer bg-white dark:bg-white/10 text-gray-800 dark:text-white rounded-2xl p-4 shadow-md backdrop-blur-lg flex flex-col gap-2 hover:scale-[1.03] transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/20"
  >
    <div className="flex items-center gap-4">
      <div className="text-3xl text-blue-500 dark:text-blue-300">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
        <span className="text-xl font-semibold">{value}</span>
      </div>
    </div>
    {children && <div>{children}</div>}
  </motion.div>
);

const AnalyticsCard = ({ label, value, link, emoji }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-white/10 p-4 rounded-xl shadow">
    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-400/20 rounded-full flex items-center justify-center text-blue-600 text-xl">
      {emoji}
    </div>
    <div>
      <NavLink to={link} className="text-sm text-gray-500 dark:text-gray-300 hover:underline">
        <p>{label}</p>
      </NavLink>
      <p className="text-lg font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default Dashboard;
