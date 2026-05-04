import { recentActivityData } from '@/utils/chartData';
import { ArrowRight, User, Gamepad2, Trophy, Settings } from 'lucide-react';

const iconMap: { [key: string]: React.ReactNode } = {
  user: <User className="w-5 h-5" />,
  gamepad2: <Gamepad2 className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
};

export default function RecentActivity() {
  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-linear-to-b from-purple-600 to-pink-600 rounded-full font-[nunito]" />
          Recent Activity
        </h3>
        <button className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors font-[nunito]">
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {recentActivityData.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-lg shrink-0 group-hover:bg-slate-600 transition-colors text-purple-400">
              {iconMap[activity.icon as keyof typeof iconMap]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white font-semibold text-sm font-[nunito] ">
                    {activity.user}
                  </p>
                  <p className="text-slate-400 text-xs mt-1 font-[nunito]">
                    {activity.action}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
              </div>
              <p className="text-slate-500 text-xs mt-2 font-[nunito]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-slate-700 via-slate-600 to-transparent my-4" />

      {/* Footer */}
      <button className=" font-[nunito] w-full px-4 py-2 text-center text-sm font-semibold text-purple-400 hover:text-purple-300 hover:bg-slate-700/50 rounded-lg transition-all">
        View Activity Log
      </button>
    </div>
  );
}
