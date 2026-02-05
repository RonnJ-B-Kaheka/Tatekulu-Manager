import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Calendar, Clock, User, Scissors } from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Barber {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  customer: { name: string; phone: string };
  barber: { name: string } | null;
  service: { name: string; price: number } | null;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [formData, setFormData] = useState({
    customer_id: '',
    barber_id: '',
    service_id: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    appointment_time: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, customersRes, barbersRes, servicesRes] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            notes,
            customer:customers(name, phone),
            barber:barbers(name),
            service:services(name, price)
          `)
          .eq('appointment_date', selectedDate)
          .order('appointment_time', { ascending: true }),
        supabase.from('customers').select('id, name, phone').order('name'),
        supabase.from('barbers').select('id, name').eq('is_active', true).order('name'),
        supabase.from('services').select('id, name, duration_minutes, price').eq('is_active', true).order('name'),
      ]);

      const formattedAppointments = (appointmentsRes.data || []).map((apt: any) => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        status: apt.status,
        notes: apt.notes,
        customer: Array.isArray(apt.customer) ? apt.customer[0] : apt.customer,
        barber: Array.isArray(apt.barber) ? apt.barber[0] : apt.barber,
        service: Array.isArray(apt.service) ? apt.service[0] : apt.service,
      }));

      setAppointments(formattedAppointments);
      setCustomers(customersRes.data || []);
      setBarbers(barbersRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('appointments').insert({
        customer_id: formData.customer_id,
        barber_id: formData.barber_id || null,
        service_id: formData.service_id || null,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        notes: formData.notes,
        status: 'scheduled',
      });

      if (error) throw error;

      setShowModal(false);
      setFormData({
        customer_id: '',
        barber_id: '',
        service_id: '',
        appointment_date: format(new Date(), 'yyyy-MM-dd'),
        appointment_time: '',
        notes: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-600 mt-1">Manage and schedule appointments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>New Appointment</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-slate-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="divide-y divide-slate-200">
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-lg">No appointments scheduled for this date</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-xl font-bold text-slate-900">
                        {appointment.appointment_time}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-slate-700">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{appointment.customer?.name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{appointment.customer?.phone}</span>
                      </div>
                      {appointment.barber && (
                        <div className="flex items-center space-x-2 text-slate-700">
                          <Scissors className="h-4 w-4 text-slate-400" />
                          <span>{appointment.barber.name}</span>
                        </div>
                      )}
                      {appointment.service && (
                        <div className="flex items-center space-x-2 text-slate-700">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{appointment.service.name}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold">${Number(appointment.service.price).toFixed(2)}</span>
                        </div>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-slate-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  {appointment.status === 'scheduled' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => updateStatus(appointment.id, 'completed')}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateStatus(appointment.id, 'cancelled')}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">New Appointment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer *
                </label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Barber
                </label>
                <select
                  value={formData.barber_id}
                  onChange={(e) => setFormData({ ...formData, barber_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select barber</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Service
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${Number(service.price).toFixed(2)} ({service.duration_minutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Special requests or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
