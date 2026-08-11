import { useState, useEffect } from 'react';
import { Plus, Mail, Phone, Hash, Trash2 } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', identification: '' });

  const loadClients = async () => {
    try {
      const res = await apiClient.get('/clients');
      setClients(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/clients', newClient);
      setNewClient({ name: '', email: '', phone: '', identification: '' });
      setIsCreating(false);
      loadClients();
    } catch (e) {
      console.error(e);
      alert('Error al crear cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
    try {
      await apiClient.delete(`/clients/${id}`);
      loadClients();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-500">Gestiona los clientes de tu empresa</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-4">Agregar Cliente</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Ej. Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="juan@ejemplo.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="+34 123 456 789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Identificación</label>
              <input value={newClient.identification} onChange={e => setNewClient({...newClient, identification: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="DNI / CIF" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">Guardar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Identificación</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{client.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> {client.email || '-'}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> {client.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex items-center gap-2"><Hash className="w-4 h-4 text-slate-400"/> {client.identification || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
