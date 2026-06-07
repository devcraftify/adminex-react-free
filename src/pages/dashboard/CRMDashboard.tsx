/**
 * CRM Dashboard
 * UX Structure: Kanban board + Multi-panel layout
 * - Horizontal pipeline as main feature
 * - Cards arranged in columns
 * - Activity feed prominent
 * - Contact profiles focus
 */
import { Icon, Icons } from '@/components/common'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { pipeline, crmContacts, activities } from '@/data'
import { StatCard, ChartCard } from '@/components/dashboard'

import { useLocale } from '@/i18n'

export function CRMDashboard() {
  const { t } = useLocale()
  const leadData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [{
      label: 'Leads',
      data: [45, 68, 52, 84, 72, 96],
      fill: true,
      borderColor: chartColors.purple.solid,
      backgroundColor: chartColors.purple.light,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }],
  }

  const activityIcons: Record<string, string> = {
    call: Icons.phone,
    email: Icons.mail,
    meeting: Icons.calendar,
    task: Icons.briefcase,
  }

  const statusColors: Record<string, string> = {
    hot: 'bg-red-500',
    warm: 'bg-orange-500',
    new: 'bg-blue-500',
  }

  const avatarColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ]

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900 dark:text-white">{t('dashboard.crm_pipeline')}</h1>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('dashboard.manage_deals')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Icon icon={Icons.search} width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input 
              type="text" 
              placeholder={t('dashboard.search_contacts')}
              className="pl-9 pr-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm rounded-lg text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 w-64 transition-all focus:w-72"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-theme-primary/20">
            <Icon icon={Icons.plus} width={16} height={16} />
            {t('dashboard.new_deal')}
          </button>
        </div>
      </div>

      {/* Kanban Pipeline - Full Width Horizontal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('dashboard.deal_pipeline')}</h2>
          <div className="flex items-center gap-4 text-sm bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-lg">
            <span className="text-secondary-500">{t('dashboard.total_value')}:</span>
            <span className="font-bold text-secondary-900 dark:text-white">$573,000</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-2">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="flex flex-col h-full min-w-[280px]">
              {/* Stage Header */}
              <div className={`rounded-t-xl ${stage.headerBg} p-3 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color} ring-2 ring-white dark:ring-surface-900`} />
                  <span className="font-semibold text-secondary-900 dark:text-white text-sm">{stage.stage}</span>
                </div>
                <span className="text-xs font-bold text-secondary-600 dark:text-secondary-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">
                  {stage.deals.length}
                </span>
              </div>
              
              {/* Deals List */}
              <div className="bg-surface-50 dark:bg-surface-800/30 rounded-b-xl p-3 space-y-3 flex-1 border border-t-0 border-surface-200 dark:border-surface-700">
                {stage.deals.map((deal) => (
                  <div 
                    key={deal.company} 
                    className="bg-white dark:bg-surface-800 p-3 rounded-lg shadow-sm border border-surface-100 dark:border-surface-700 cursor-pointer hover:shadow-md hover:border-theme-primary/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-secondary-900 dark:text-white group-hover:text-theme-primary transition-colors">{deal.company}</h4>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-all">
                        <Icon icon={Icons.dotsVertical} width={14} height={14} className="text-secondary-400" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-secondary-900 dark:text-white mb-1">{deal.value}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-theme-primary/10 flex items-center justify-center text-ui-2xs font-bold text-theme-primary">
                        {deal.contact.charAt(0)}
                      </div>
                      <p className="text-xs text-secondary-500">{deal.contact}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-700">
                      <span className="text-ui-2xs font-medium text-secondary-400 bg-surface-100 dark:bg-surface-700/50 px-1.5 py-0.5 rounded">
                        {deal.days} days
                      </span>
                      <Icon icon={Icons.chevronRight} width={14} height={14} className="text-secondary-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 text-xs font-medium text-secondary-500 hover:text-theme-primary hover:bg-white dark:hover:bg-surface-800 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg transition-all flex items-center justify-center gap-1">
                  <Icon icon={Icons.plus} width={12} height={12} />
                  {t('dashboard.add_deal')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Column Layout Below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Column */}
        <ChartCard 
          title={t('dashboard.todays_schedule')} 
          subtitle={`${activities.filter(a => !a.done).length} ${t('dashboard.tasks_remaining')}`}
          className="h-full"
        >
          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const activityIcon = activityIcons[activity.type]
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-xl transition-all ${
                    activity.done 
                      ? 'opacity-60 bg-surface-50 dark:bg-surface-800/30' 
                      : 'bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-surface-100 dark:bg-surface-700'
                  }`}>
                    {activity.done ? (
                      <Icon icon={Icons.check} width={18} height={18} className="text-green-600" />
                    ) : (
                      <Icon icon={activityIcon} width={18} height={18} className="text-secondary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm font-semibold ${activity.done ? 'line-through text-secondary-400' : 'text-secondary-900 dark:text-white'}`}>
                        {activity.title}
                      </p>
                      <span className="text-xs font-medium text-secondary-400 bg-surface-100 dark:bg-surface-700 px-1.5 py-0.5 rounded">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 truncate">{activity.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Contacts Column */}
        <ChartCard 
          title={t('dashboard.key_contacts')} 
          subtitle={t('dashboard.recent_interactions')}
          action={<button className="text-xs text-theme-primary font-medium hover:underline">{t('dashboard.view_all')}</button>}
          className="h-full"
        >
          <div className="space-y-4">
            {crmContacts.map((contact, index) => (
              <div key={contact.email} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all group border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white dark:ring-surface-800`}>
                    {contact.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${statusColors[contact.status]} border-2 border-white dark:border-surface-900`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-secondary-900 dark:text-white truncate">{contact.name}</p>
                    <span className={`text-ui-2xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      contact.status === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      contact.status === 'warm' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500 font-medium truncate">{contact.role}</p>
                  <p className="text-xs text-secondary-400 truncate">{contact.company}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors text-secondary-500 hover:text-theme-primary">
                    <Icon icon={Icons.phone} width={14} height={14} />
                  </button>
                  <button className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors text-secondary-500 hover:text-theme-primary">
                    <Icon icon={Icons.mail} width={14} height={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Lead Metrics Column */}
        <div className="space-y-6">
          <StatCard
            label={t('dashboard.total_leads')}
            value="384"
            change="23.5%"
            isPositive={true}
            icon={Icons.users}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard
            label={t('dashboard.conversion_rate')}
            value="24.8%"
            change="1.2%"
            isPositive={true}
            icon={Icons.trendingUp}
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />

          <ChartCard title={t('dashboard.lead_trend')} subtitle={t('dashboard.last_6_weeks')}>
            <AreaChart data={leadData} height={140} options={{ plugins: { legend: { display: false } } }} />
          </ChartCard>

          <div className="card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-4">{t('dashboard.lead_sources')}</h3>
            <div className="space-y-3">
              {[
                { source: t('dashboard.website'), value: 45, color: 'bg-blue-500' },
                { source: t('dashboard.referral'), value: 28, color: 'bg-green-500' },
                { source: t('dashboard.social'), value: 18, color: 'bg-purple-500' },
                { source: t('dashboard.other'), value: 9, color: 'bg-orange-500' },
              ].map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">{s.source}</span>
                    </div>
                    <span className="text-xs font-bold text-secondary-900 dark:text-white">{s.value}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
