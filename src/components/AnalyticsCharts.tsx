import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend, Area } from 'recharts';
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
};
const palette = ['#00f2fe', '#4facfe', '#ff88d9', '#9b5cff'];
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#0b1224',
        border: '1px solid rgba(0,242,254,0.25)',
        borderRadius: '16px',
        padding: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: '#fff', marginBottom: '6px' }}>
        {label}
      </p>
      <strong style={{ color: '#00f2fe' }}>
        {payload[0].value}
      </strong>
    </div>
  );
};
function AnalyticsCharts({orders,}:{orders:Order[]}) {
  const {products} = useAppContext();

  const revenueSeries = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * (6 - index));
      const value = orders
        .filter((order) => new Date(order.createdAt).toDateString() === date.toDateString())
        .reduce((sum, order) => sum + order.total, 0);

      return { date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: value };
    });
    return days;
  }, [orders]);

  const topProducts = useMemo(() => {
  return [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      volume: product.stock,
    }));
}, [products]);

const categoryShare = useMemo(() => {
  const totals =products.reduce((acc: any, product) => {
        acc[product.category] =(acc[product.category] || 0)+ product.stock;
        return acc;
      },
      {}
    );
  return Object.entries(totals).map(([name, value]) => ({name,value,}));
}, [products]);

const orderStatusData =useMemo(() => {
  const counts: any = {};
  orders.forEach((order) => {
      counts[order.status] =(counts[order.status] || 0)+ 1;
    }
  );
  return Object.entries(counts).map(([name, value]) => ({name,value,}));
}, [orders]);

  return (
    <div className="analytics-charts">
      <article className="chart-card glass-panel">
  <div className="chart-header">
    <p className="eyebrow">Sales trend</p>
    <h3>Revenue curve</h3>
  </div>

  <ResponsiveContainer width="100%" height={260}>
    <AreaChart
      data={revenueSeries}
      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
    >
      <defs>
        <linearGradient
          id="revenueGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor="#00f2fe"
            stopOpacity={0.8}
          />
          <stop
            offset="95%"
            stopColor="#090f1b"
            stopOpacity={0.1}
          />
        </linearGradient>
      </defs>

      <XAxis
        dataKey="date"
        tick={{ fill: '#aab7d2', fontSize: 12 }}
        axisLine={false}
        tickLine={false}
      />

      <CartesianGrid
        vertical={false}
        stroke="#18223b"
        strokeDasharray="3 3"
      />

      <Tooltip content={<CustomTooltip />} />

      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#4facfe"
        fill="url(#revenueGradient)"
        strokeWidth={3}
        isAnimationActive={true}
        animationDuration={2200}
        animationEasing="ease-out"
      />
    </AreaChart>
  </ResponsiveContainer>
</article>
      <article className="chart-card glass-panel">
        <div className="chart-header">
          <p className="eyebrow">Inventory Leaders</p>
          <h3>Highest Inventory</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#18223b" strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fill: '#aab7d2', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#e3eaf4', fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" radius={[10, 10, 10, 10]} animationDuration={1800} animationEasing="ease-out">
              {topProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </article>
      
      <article className="chart-card glass-panel">
        <div className="chart-header">
          <p className="eyebrow">Order Status</p>
          <h3>Current Orders</h3>
        </div>

        {orderStatusData.length === 0 ? (
          <p>No order data available</p>
        ):(<ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Legend iconType="circle" wrapperStyle={{color: '#cbd5e1',fontSize: 12,}}/>
            <Pie
              data={orderStatusData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {orderStatusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      palette[
                        index %
                        palette.length
                      ]
                    }
                  />
                )
              )}

            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>)}
      </article>

      <article className="chart-card glass-panel">
        <div className="chart-header">
          <p className="eyebrow">Category mix</p>
          <h3>Inventory distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Legend iconType="circle" wrapperStyle={{ color: '#cbd5e1', fontSize: 12 }} />
            <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={4} stroke="transparent" isAnimationActive={true} animationDuration={1800}>
              {categoryShare.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </article>
    </div>
  );
}

export default AnalyticsCharts;
