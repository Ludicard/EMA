import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Building, Plus, LogIn, ArrowRight } from 'lucide-react';
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
  
  // Onboarding states
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [joinCompanyId, setJoinCompanyId] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/dashboard/stats');
      setStats(res.data);
    } catch (e: any) {
      if (e.response?.status === 400 && e.response?.data?.message?.includes('empresa')) {
        setStats({ noCompany: true });
      } else {
        console.error('Error fetching stats:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);
    try {
      const res = await apiClient.post('/companies', { name: companyName });
      localStorage.setItem('accessToken', res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      window.location.reload();
    } catch (e: any) {
      setActionError(e.response?.data?.message || 'Error al crear la empresa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);
    try {
      const res = await apiClient.post('/companies/join', { companyId: joinCompanyId });
      localStorage.setItem('accessToken', res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      window.location.reload();
    } catch (e: any) {
      setActionError(e.response?.data?.message || 'Error al unirse a la empresa');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  // --- VISTA DE ONBOARDING ---
  if (stats?.noCompany) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Building className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">¡Bienvenido a EMA!</h2>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
            Para comenzar a gestionar tu negocio, necesitas configurar tu espacio de trabajo. ¿Qué deseas hacer?
          </p>
        </div>

        {actionError && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200 text-center">
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Crear Empresa */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-primary/50 transition-colors flex flex-col">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Crear una Empresa</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Ideal si eres el administrador o dueño y quieres configurar EMA desde cero.
            </p>
            
            {isCreating ? (
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Nombre de la empresa"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={actionLoading} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    {actionLoading ? 'Creando...' : 'Crear'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => { setIsCreating(true); setIsJoining(false); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                Crear Empresa
              </button>
            )}
          </div>

          {/* Card Unirse a Empresa */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-primary/50 transition-colors flex flex-col">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unirse a una Empresa</h3>
            <p className="text-slate-500 mb-6 flex-grow">
              Si tu equipo ya usa EMA, pídeles el Código de Empresa (ID) para unirte a ellos.
            </p>

            {isJoining ? (
              <form onSubmit={handleJoinCompany} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="ID de la empresa"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={joinCompanyId}
                  onChange={(e) => setJoinCompanyId(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsJoining(false)} className="px-4 py-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={actionLoading} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    {actionLoading ? 'Verificando...' : 'Unirse'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => { setIsJoining(true); setIsCreating(false); }} className="w-full bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors border border-slate-300">
                Tengo un código
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA NORMAL DE DASHBOARD ---
  if (!stats) {
    return <div className="text-center text-red-500 py-10">No se pudieron cargar las estadísticas.</div>;
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
