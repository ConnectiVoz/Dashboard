const StatCard = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-white/10 text-gray-800 dark:text-white rounded-2xl p-4 shadow-md backdrop-blur-lg flex items-center sm:items-start gap-4 hover:scale-[1.03] transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/20"
  >
    <div className="text-3xl text-blue-500 dark:text-blue-300">{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  </motion.div>
);
export default StatCard;