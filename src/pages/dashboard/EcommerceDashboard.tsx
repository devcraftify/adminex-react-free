/**
 * eCommerce Dashboard
 * UX Structure: Split layout with sidebar summary
 * - Left: Large content area with products/orders
 * - Right: Sticky sidebar with quick stats and charts
 * - Focus on product cards and order list
 */
import { Icon, Icons } from '@/components/common'
import { LineChart, DoughnutChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { products, orders, orderStatusConfig, stockStatusConfig } from '@/data'
import { StatCard, ChartCard } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function EcommerceDashboard() {
  const { t } = useLocale()
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Revenue',
      data: [32000, 42000, 38000, 52000, 48000, 61000, 68000],
      borderColor: chartColors.green.solid,
      backgroundColor: 'transparent',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    }],
  }

  const categoryData = {
    labels: ['Electronics', 'Fashion', 'Home', 'Sports'],
    datasets: [{
      data: [35, 25, 22, 18],
      backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.green.solid, chartColors.orange.solid],
      borderWidth: 0,
      cutout: '70%',
    }],
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900 dark:text-white">{t('dashboard.ecommerce_overview')}</h1>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('dashboard.manage_store')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <Icon icon={Icons.filter} width={16} height={16} />
            {t('dashboard.filter')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-theme-primary/20">
            <Icon icon={Icons.plus} width={16} height={16} />
            {t('dashboard.add_product')}
          </button>
        </div>
      </div>

      {/* Split Layout: Main Content + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content Area (3 columns) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Products Table */}
          <div className="card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('dashboard.top_products')}</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">{t('dashboard.best_selling_items')}</p>
              </div>
              <button className="text-sm text-theme-primary font-medium hover:underline flex items-center gap-1">
                {t('dashboard.view_all')} <Icon icon={Icons.chevronRight} width={16} height={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.product')}</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.sku')}</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.price')}</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.stock')}</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.sold')}</th>
                    <th className="text-center py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.rating')}</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                            <Icon icon={Icons.image} width={20} height={20} className="text-secondary-400" />
                          </div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">{product.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-secondary-500 font-mono">{product.sku}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-secondary-900 dark:text-white text-right">${product.price}</td>
                      <td className="py-4 px-6 text-sm text-secondary-600 dark:text-secondary-400 text-right">{product.stock}</td>
                      <td className="py-4 px-6 text-sm text-secondary-600 dark:text-secondary-400 text-right">{product.sold}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 text-sm bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg text-yellow-700 dark:text-yellow-400">
                          <Icon icon={Icons.star} width={14} height={14} className="text-yellow-400 fill-yellow-400" />
                          {product.rating}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stockStatusConfig[product.status || 'active'].color}`}>
                          {stockStatusConfig[product.status || 'active'].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('dashboard.recent_orders')}</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">{t('dashboard.latest_transactions')}</p>
              </div>
              <button className="text-sm text-theme-primary font-medium hover:underline flex items-center gap-1">
                {t('dashboard.view_all')} <Icon icon={Icons.chevronRight} width={16} height={16} />
              </button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {orders.map((order) => {
                const status = orderStatusConfig[order.status]
                const statusIcon = order.status === 'delivered' ? Icons.check : order.status === 'shipped' ? Icons.truck : Icons.clock
                return (
                  <div key={order.id} className="p-4 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <Icon icon={statusIcon} width={24} height={24} className={status.color} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-secondary-900 dark:text-white">{order.id}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color} border border-current/10`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-500">{order.customer} · <span className="text-secondary-400">{order.items} items</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-secondary-900 dark:text-white">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-secondary-400 mt-1">{order.date}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar (1 column) - Sticky on Desktop */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Stats Stack */}
          <div className="space-y-4">
            <StatCard
              label={t('dashboard.total_revenue')}
              value="$84,245"
              change="12.5%"
              isPositive={true}
              icon={Icons.currencyDollar}
              iconBg="bg-green-100 dark:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.total_orders')}
              value="2,845"
              change="8.1%"
              isPositive={true}
              icon={Icons.shopping}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.products_sold')}
              value="5,428"
              change="2.3%"
              isPositive={false}
              icon={Icons.package}
              iconBg="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
              showMenu={false}
            />
            <StatCard
              label={t('dashboard.growth_rate')}
              value="+15.3%"
              change="4.2%"
              isPositive={true}
              icon={Icons.trendingUp}
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              iconColor="text-orange-600 dark:text-orange-400"
              showMenu={false}
            />
          </div>

          {/* Monthly Goal */}
          <div className="card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{t('dashboard.monthly_goal')}</h3>
              <span className="text-xs font-medium text-secondary-500">85%</span>
            </div>
            <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-theme-primary rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-xs text-secondary-500">$84,245 / $100,000</p>
          </div>

          {/* Revenue Trend - Small */}
          <ChartCard title={t('dashboard.revenue_trend')} subtitle={t('dashboard.last_7_months')}>
            <LineChart data={revenueData} height={180} options={{ plugins: { legend: { display: false } } }} />
          </ChartCard>

          {/* Sales by Category - Small */}
          <ChartCard title={t('dashboard.by_category')} subtitle={t('dashboard.sales_distribution')}>
            <div className="flex justify-center mb-6">
              <DoughnutChart data={categoryData} height={160} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Electronics', 'Fashion', 'Home', 'Sports'].map((cat, i) => (
                <div key={cat} className="flex items-center gap-2 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.green.solid, chartColors.orange.solid][i] }} />
                  <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300 truncate">{cat}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
