import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const leadsData = data.filter(item => item.status === 'lead');
            const bookingsData = data.filter(item => item.status === 'confirmed');

            setLeads(leadsData);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = (id) => {
        const link = `${window.location.origin}/complete-booking/${id}`;
        navigator.clipboard.writeText(link);
        alert('Booking link copied to clipboard!');
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto py-20 px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-16 text-center">Admin Dashboard</h2>

            <div className="space-y-24">
                {/* Leads Section */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-sky-400">Leads ({leads.length})</h3>
                    <div className="rounded-md border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Expiry</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">{new Date(lead.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-white">{lead.client_email}</td>
                                            <td className="px-6 py-4">{lead.address}</td>
                                            <td className="px-6 py-4">{lead.expiry_date}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => copyLink(lead.id)}
                                                    className="text-sky-400 hover:text-sky-300 font-medium"
                                                >
                                                    Copy Link
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No leads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Confirmed Bookings Section */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-green-400 ml-4">Confirmed Bookings ({bookings.length})</h3>
                    <div className="rounded-md border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Client Email</th>
                                        <th className="px-6 py-4">Address</th>
                                        <th className="px-6 py-4">Contact Name</th>
                                        <th className="px-6 py-4">Contact Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">{new Date(booking.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-white">{booking.client_email}</td>
                                            <td className="px-6 py-4">{booking.address}</td>
                                            <td className="px-6 py-4">{booking.tenant_name || '-'}</td>
                                            <td className="px-6 py-4">
                                                {booking.tenant_phone && <div>{booking.tenant_phone}</div>}
                                                {booking.tenant_email && <div>{booking.tenant_email}</div>}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No confirmed bookings found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
