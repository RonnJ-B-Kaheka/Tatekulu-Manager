import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Scissors } from 'lucide-react';

interface Barber {
  id: string;
  name: string;
  specialty: string;
  is_active: boolean;
  created_at: string;
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    is_active: true,
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('name');

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        const { error } = await supabase
          .from('barbers')
          .update({
            name: formData.name,
            specialty: formData.specialty,
            is_active: formData.is_active,
          })
          .eq('id', editingBarber.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('barbers').insert({
          name: formData.name,
          specialty: formData.specialty,
          is_active: formData.is_active,
        });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingBarber(null);
      setFormData({ name: '', specialty: '', is_active: true });
      loadBarbers();
    } catch (error) {
      console.error('Error saving barber:', error);
      alert('Failed to save barber');
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name,
      specialty: barber.specialty,
      is_active: barber.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this barber?')) {
      return;
    }

    try {
      const { error } = await supabase.from('barbers').delete().eq('id', id);
      if (error) throw error;
      loadBarbers();
    } catch (error) {
      console.error('Error deleting barber:', error);
      alert('Failed to delete barber');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBarber(null);
    setFormData({ name: '', specialty: '', is_active: true });
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
          <h1 className="text-3xl font-bold text-slate-900">Barbers</h1>
          <p className="text-slate-600 mt-1">Manage your barber staff</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add Barber</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Scissors className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="text-lg text-slate-500">No barbers added yet</p>
          </div>
        ) : (
          barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                {barber.is_active ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{barber.name}</h3>
              <p className="text-slate-600 text-sm mb-4">{barber.specialty || 'No specialty'}</p>
              <div className="flex space-x-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEdit(barber)}
                  className="flex-1 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(barber.id)}
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
                {editingBarber ? 'Edit Barber' : 'Add Barber'}
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
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g., Fades, Beard Styling"
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
                  Active (can accept appointments)
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
                  {editingBarber ? 'Update' : 'Add'} Barber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
