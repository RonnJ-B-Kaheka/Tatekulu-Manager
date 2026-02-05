import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Briefcase, Clock, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 30,
    price: 0,
    is_active: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description,
            duration_minutes: formData.duration_minutes,
            price: formData.price,
            is_active: formData.is_active,
          })
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert({
          name: formData.name,
          description: formData.description,
          duration_minutes: formData.duration_minutes,
          price: formData.price,
          is_active: formData.is_active,
        });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', description: '', duration_minutes: 30, price: 0, is_active: true });
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: Number(service.price),
      is_active: service.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', duration_minutes: 30, price: 0, is_active: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services</h1>
          <p className="text-slate-600 mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="text-lg text-slate-500">No services added yet</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                {service.is_active ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
              <p className="text-slate-600 text-sm mb-4 min-h-[40px]">
                {service.description || 'No description'}
              </p>
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{service.duration_minutes} min</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-900">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xl font-bold">{Number(service.price).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Haircut"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Service details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Active (available for booking)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
                >
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
