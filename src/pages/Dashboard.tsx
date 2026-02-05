import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  todayAppointments: number;
  totalCustomers: number;
  activeBarbers: number;
  todayRevenue: number;
}

interface UpcomingAppointment {
  id: string;
  appointment_time: string;
  customer: { name: string };
  barber: { name: string } | null;
  service: { name: string; price: number } | null;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    totalCustomers: 0,
    activeBarbers: 0,
    todayRevenue: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');

      const [appointmentsRes, customersRes, barbersRes, revenueRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('id')
          .eq('appointment_date', today)
          .neq('status', 'cancelled'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('barbers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase
          .from('appointments')
          .select('service_id, services(price)')
          .eq('appointment_date', today)
          .eq('status', 'completed'),
      ]);

      const revenue = revenueRes.data?.reduce((sum, apt: any) => {
        const service = Array.isArray(apt.services) ? apt.services[0] : apt.services;
        const price = service?.price || 0;
        return sum + Number(price);
      }, 0) || 0;

      setStats({
        todayAppointments: appointmentsRes.data?.length || 0,
        totalCustomers: customersRes.count || 0,
        activeBarbers: barbersRes.count || 0,
        todayRevenue: revenue,
      });

      const { data: upcoming } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_time,
          status,
          customer:customers(name),
          barber:barbers(name),
          service:services(name, price)
        `)
        .eq('appointment_date', today)
        .eq('status', 'scheduled')
        .order('appointment_time', { ascending: true })
        .limit(5);

      const formattedAppointments = (upcoming || []).map((apt: any) => ({
        id: apt.id,
        appointment_time: apt.appointment_time,
        status: apt.status,
        customer: Array.isArray(apt.customer) ? apt.customer[0] : apt.customer,
        barber: Array.isArray(apt.barber) ? apt.barber[0] : apt.barber,
        service: Array.isArray(apt.service) ? apt.service[0] : apt.service,
      }));

      setUpcomingAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Active Barbers',
      value: stats.activeBarbers,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-slate-900',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
          <p className="text-sm text-slate-600 mt-1">Today's scheduled appointments</p>
        </div>
        <div className="divide-y divide-slate-200">
          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p>No upcoming appointments for today</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-slate-900">
                        {appointment.appointment_time}
                      </span>
                      <span className="text-slate-600">{appointment.customer?.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {appointment.barber?.name && (
                        <span>with {appointment.barber.name}</span>
                      )}
                      {appointment.service?.name && (
                        <span className="ml-2">• {appointment.service.name}</span>
                      )}
                    </div>
                  </div>
                  {appointment.service?.price && (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        ${Number(appointment.service.price).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
