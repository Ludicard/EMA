import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { apiClient } from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/dashboard/stats');
        setStats(res.data);
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!stats) {
    return <div className="text-center text-red-500 py-10">No se pudieron cargar las estadísticas. Asegúrate de tener una empresa configurada.</div>;
  }

  const formatMoney = (amount: number) => `$${Number(amount).toFixed(2)}`;

  const pieData = [
    { name: 'Cobrado', value: stats.paidCount, color: '#10B981' },
    { name: 'Pendiente', value: stats.pendingCount, color: '#F59E0B' },
    { name: 'Vencido', value: stats.overdueCount, color: '#EF4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resumen Financiero</h1>
        <p className="text-slate-500">Un vistazo rápido al estado de tus cuentas.</p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Facturado</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalInvoiced)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Cobrado</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalPaid)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pendiente</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalPending)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Vencido</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalOverdue)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Evolución (Últimos 6 meses)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [formatMoney(Number(value)), '']}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="facturado" name="Facturado" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="cobrado" name="Cobrado" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart (1/3 width) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Estado de Cartera</h3>
          {pieData.length > 0 ? (
            <div className="h-64 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 flex-grow">
              No hay facturas registradas
            </div>
          )}
          
          <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total Facturas</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{stats.totalInvoices}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Clientes Activos</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{stats.totalClients}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/clients" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-indigo-300 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gestión de Clientes</h3>
              <p className="text-sm text-slate-500">Administra tu cartera</p>
            </div>
          </div>
          <div className="text-indigo-400 font-medium group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
            &rarr;
          </div>
        </Link>

        <Link to="/invoices" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-purple-300 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Control de Facturas</h3>
              <p className="text-sm text-slate-500">Crea y revisa facturas</p>
            </div>
          </div>
          <div className="text-purple-400 font-medium group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
            &rarr;
          </div>
        </Link>
      </div>
    </div>
  );
}
