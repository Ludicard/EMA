import { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ clientId: '', number: '', issueDate: '', dueDate: '', estimatedPaymentDate: '', amount: '', notes: '' });

  const loadData = async () => {
    try {
      const [invRes, cliRes] = await Promise.all([
        apiClient.get('/invoices'),
        apiClient.get('/clients')
      ]);
      setInvoices(invRes.data);
      setClients(cliRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/invoices', {
        ...newInvoice,
        amount: parseFloat(newInvoice.amount),
      });
      setNewInvoice({ clientId: '', number: '', issueDate: '', dueDate: '', estimatedPaymentDate: '', amount: '', notes: '' });
      setIsCreating(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error al crear factura');
    }
  };

  const handlePay = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const date = prompt('¿Fecha de pago? (Dejar en blanco para usar fecha actual)', today);
    if (date === null) return;
    
    try {
      await apiClient.patch(`/invoices/${id}/pay`, { paidAt: date || new Date().toISOString() });
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error al marcar como pagada');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta factura?')) return;
    try {
      await apiClient.delete(`/invoices/${id}`);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'PAID') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Pagada</span>;
    }
    if (status === 'CANCELLED') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 flex items-center gap-1 w-max">Cancelada</span>;
    }
    
    // Check if overdue
    if (new Date(dueDate) < new Date()) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-max"><AlertCircle className="w-3 h-3"/> Vencida</span>;
    }

    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pendiente</span>;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Facturas</h1>
          <p className="text-slate-500">Gestiona tus cuentas por cobrar</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-4">Emitir Factura</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
              <select required value={newInvoice.clientId} onChange={e => setNewInvoice({...newInvoice, clientId: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary">
                <option value="">Seleccione un cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de Factura</label>
              <input required value={newInvoice.number} onChange={e => setNewInvoice({...newInvoice, number: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="F-2023-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto Total</label>
              <input required type="number" step="0.01" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Emisión</label>
              <input required type="date" value={newInvoice.issueDate} onChange={e => setNewInvoice({...newInvoice, issueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Vencimiento</label>
              <input required type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pago Estimado (Opcional)</label>
              <input type="date" value={newInvoice.estimatedPaymentDate} onChange={e => setNewInvoice({...newInvoice, estimatedPaymentDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas (Opcional)</label>
              <textarea value={newInvoice.notes} onChange={e => setNewInvoice({...newInvoice, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Notas adicionales..." rows={2} />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">Guardar Factura</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {invoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400"/> {invoice.number}</div>
                  <div className="text-xs text-slate-500 mt-1">Vence: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{invoice.client?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">${Number(invoice.amount).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status, invoice.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {invoice.status === 'PENDING' && (
                    <button onClick={() => handlePay(invoice.id)} className="text-green-600 hover:text-green-800 font-semibold bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 mr-2 transition-colors">
                      Cobrar
                    </button>
                  )}
                  <button onClick={() => handleDelete(invoice.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No hay facturas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
