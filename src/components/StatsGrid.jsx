function StatsGrid() {
  return (
    <div className="w-full px-4 mx-auto ">
      <div className="grid w-full gap-4">
        <div className="p-6  bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg 
                      dark:from-purple-600 dark:to-indigo-700">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Users</p>
              <h3 className="text-white text-2xl font-bold mt-2">2,543</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              {/* Icon */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-white/80">
            <span className="text-green-300">↑ 12%</span>
            <span className="ml-2">from last month</span>
          </div>
        </div>

        {/* Add more similar cards with different gradients and metrics */}
      </div>
    </div>
  )
}

export default StatsGrid 