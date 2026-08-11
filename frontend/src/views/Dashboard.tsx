import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { apiClient } from '../api/client';

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
              <p className="text-sm font-medium text-slate-500">Pendiente de Cobro</p>
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
              <p className="text-sm font-medium text-slate-500">Total Vencido</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalOverdue)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-primary transition-colors group">
          <div>
            <div className="w-10 h-10 bg-slate-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors">
              <Users className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Clientes</h3>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalClients}</p>
          </div>
          <Link to="/clients" className="text-sm font-medium text-primary mt-4 inline-block hover:underline">Ver clientes &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-primary transition-colors group">
          <div>
            <div className="w-10 h-10 bg-slate-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors">
              <FileText className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Facturas Totales</h3>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalInvoices}</p>
          </div>
          <Link to="/invoices" className="text-sm font-medium text-primary mt-4 inline-block hover:underline">Ir a facturas &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Estado de Facturas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500"/> Pendientes</span>
                <span className="font-bold text-slate-900">{stats.pendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500"/> Vencidas</span>
                <span className="font-bold text-slate-900">{stats.overdueCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
