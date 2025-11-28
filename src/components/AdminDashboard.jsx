import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [batchQuote, setBatchQuote] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch leads
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (leadsError) throw leadsError;

            // Fetch confirmed bookings with lead details
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('confirmed_bookings')
                .select(`
                    *,
                    leads (
                        address,
                        client_email,
                        expiry_date,
                        quoted_price
                    )
                `)
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            setLeads(leadsData);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLeadSelection = (id) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(lead => lead.id));
        }
    };

    const applyBatchQuote = async () => {
        if (!batchQuote || selectedLeads.length === 0) {
            alert('Please enter a quote and select at least one lead.');
            return;
        }

        setIsApplying(true);

        try {
            const { error } = await supabase
                .from('leads')
                .update({ quoted_price: parseFloat(batchQuote) })
                .in('id', selectedLeads);

            if (error) throw error;

            alert(`Quote of £${batchQuote} applied to ${selectedLeads.length} lead(s)`);
            setSelectedLeads([]);
            setBatchQuote('');
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error applying batch quote:', error);
            alert('Failed to apply quote. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto py-12 px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Admin Dashboard</h2>

            <div className="space-y-12">
                {/* Leads Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-2xl font-semibold text-sky-400 mb-2">Leads ({leads.length})</h3>
                    
                    {/* Batch Quote Section */}
                    {leads.length > 0 && (
                        <div className="p-5 bg-slate-800/50 rounded-lg border border-slate-700" style={{ padding: '0.2rem' }}>
                            <div className="flex items-center gap-4">
                                <label className="whitespace-nowrap font-semibold text-slate-200" style={{ margin: 0 }}>Quote Price (£)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={batchQuote}
                                    onChange={(e) => setBatchQuote(e.target.value)}
                                    placeholder="e.g. 75.00"
                                    className="input flex-1"
                                />
                                <button
                                    onClick={applyBatchQuote}
                                    disabled={isApplying || selectedLeads.length === 0}
                                    className={`btn btn-primary whitespace-nowrap ${isApplying || selectedLeads.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ marginTop: 0 }}
                                >
                                    {isApplying ? 'Applying...' : `Apply to ${selectedLeads.length} Selected`}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="rounded-md border border-slate-700 overflow-hidden" style={{ padding: '0.2rem' }}>
                        <div className="overflow-x-auto p-1">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3 pl-8">
                                            <input
                                                type="checkbox"
                                                checked={selectedLeads.length === leads.length && leads.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Address</th>
                                        <th className="px-6 py-3">Expiry</th>
                                        <th className="px-6 py-3 pr-8">Quote</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-3 pl-8">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.includes(lead.id)}
                                                    onChange={() => toggleLeadSelection(lead.id)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-white">{lead.client_email}</td>
                                            <td className="px-6 py-3">{lead.address}</td>
                                            <td className="px-6 py-3">{lead.expiry_date}</td>
                                            <td className="px-6 py-3 pr-8">
                                                {lead.quoted_price ? `£${parseFloat(lead.quoted_price).toFixed(2)}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500 pl-8 pr-8">No leads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Confirmed Bookings Section */}
                <section className="flex flex-col gap-4" style={{ marginTop: '1rem' }}>
                    <h3 className="text-2xl font-semibold text-green-400 mb-2">Confirmed Bookings ({bookings.length})</h3>
                    <div className="rounded-md border border-slate-700 overflow-hidden" style={{ padding: '0.2rem' }}>
                        <div className="overflow-x-auto p-1">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-800 text-slate-200 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3 pl-8">Date</th>
                                        <th className="px-6 py-3">Client Email</th>
                                        <th className="px-6 py-3">Address</th>
                                        <th className="px-6 py-3">Contact Name</th>
                                        <th className="px-6 py-3">Contact Phone</th>
                                        <th className="px-6 py-3 pr-8">Contact Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-3 pl-8">{new Date(booking.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-white">{booking.leads?.client_email || '-'}</td>
                                            <td className="px-6 py-3">{booking.leads?.address || '-'}</td>
                                            <td className="px-6 py-3">{booking.contact_name || '-'}</td>
                                            <td className="px-6 py-3">{booking.contact_phone || '-'}</td>
                                            <td className="px-6 py-3 pr-8">{booking.contact_email || '-'}</td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500 pl-8 pr-8">No confirmed bookings found.</td>
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
