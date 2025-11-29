import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { logout } from '../lib/auth';
import { sendQuoteEmail, generateMailtoLink } from '../lib/emailService';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [batchQuote, setBatchQuote] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [glowingLeads, setGlowingLeads] = useState(new Set());
    const [sendingEmails, setSendingEmails] = useState(new Set());
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const quoteInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteLeads = async () => {
        if (selectedLeads.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedLeads.length} selected lead(s)? This action can be undone.`
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('leads')
                .update({ deleted_at: new Date().toISOString() })
                .in('id', selectedLeads);

            if (error) throw error;

            setSelectedLeads([]);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error deleting leads:', error);
            alert('Failed to delete leads. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBookingRowClick = (booking) => {
        setSelectedBooking(booking);
        setShowBookingModal(true);
    };

    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedBooking(null);
    };

    const copyBookingDetails = (booking) => {
        const details = [
            `Property Address: ${booking.leads?.address || 'N/A'}`,
            `Certificate Expiry: ${booking.leads?.expiry_date || 'N/A'}`,
            ``,
            `Contact Details:`,
            `Name: ${booking.contact_name || 'N/A'}`,
            `Phone: ${booking.contact_phone || 'N/A'}`,
            `Email: ${booking.contact_email || 'N/A'}`
        ].join('\n');

        navigator.clipboard.writeText(details);
        alert('Booking details copied to clipboard!');
    };

    const handleSendEmail = async (lead) => {
        if (!lead.client_email) {
            alert('No email address available for this lead.');
            return;
        }

        if (!lead.quoted_price) {
            alert('Please set a quote price before sending an email.');
            return;
        }

        setSendingEmails(prev => new Set(prev).add(lead.id));

        try {
            await sendQuoteEmail(lead);
            alert(`Email sent successfully to ${lead.client_email}`);
        } catch (error) {
            console.error('Error sending email:', error);
            // Fallback to mailto link
            const confirmed = window.confirm(
                'Email service not configured. Would you like to open your email client instead?'
            );
            if (confirmed) {
                window.location.href = generateMailtoLink(lead);
            }
        } finally {
            setSendingEmails(prev => {
                const newSet = new Set(prev);
                newSet.delete(lead.id);
                return newSet;
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch leads (excluding soft-deleted ones)
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('*')
                .is('deleted_at', null)
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
        // Focus the quote input after checkbox interaction
        setTimeout(() => {
            quoteInputRef.current?.focus();
        }, 0);
    };

    const toggleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(lead => lead.id));
        }
        // Focus the quote input after checkbox interaction
        setTimeout(() => {
            quoteInputRef.current?.focus();
        }, 0);
    };

    const applyBatchQuote = async () => {
        if (!batchQuote || selectedLeads.length === 0) {
            return;
        }

        setIsApplying(true);

        try {
            const { error } = await supabase
                .from('leads')
                .update({ quoted_price: parseFloat(batchQuote) })
                .in('id', selectedLeads);

            if (error) throw error;

            // Add updated leads to glowing set
            setGlowingLeads(new Set(selectedLeads));
            
            // Remove glow after 1.5 seconds
            setTimeout(() => {
                setGlowingLeads(new Set());
            }, 1500);

            setSelectedLeads([]);
            setBatchQuote('');
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error applying batch quote:', error);
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto py-12 px-6 lg:px-8" style={{ marginTop: '1rem' }}>
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-white">Admin Dashboard</h2>
                <button
                    onClick={handleLogout}
                    className="btn btn-primary text-sm px-4 py-2"
                    style={{ marginTop: 0 }}
                >
                    Logout
                </button>
            </div>

            <div className="space-y-12">
                {/* Leads Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-2xl font-semibold text-sky-400 mb-2">Leads ({leads.length})</h3>
                    
                    {/* Batch Quote Section */}
                    {leads.length > 0 && (
                        <div className="p-5 bg-slate-800/50 rounded-lg border border-slate-700" style={{ padding: '0.2rem' }}>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    // Prevent default form submission - we handle it via button click
                                }}
                                className="flex items-center gap-4"
                            >
                                <label className="whitespace-nowrap font-semibold text-slate-200" style={{ margin: 0 }}>Quote Price (£)</label>
                                <input
                                    ref={quoteInputRef}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={batchQuote}
                                    onChange={(e) => setBatchQuote(e.target.value)}
                                    onKeyDown={(e) => {
                                        // Check for Command+Enter (Mac) or Ctrl+Enter (Windows/Linux)
                                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                                            e.preventDefault();
                                            if (!isApplying && selectedLeads.length > 0 && batchQuote) {
                                                applyBatchQuote();
                                            }
                                        }
                                    }}
                                    placeholder="e.g. 75.00"
                                    className="input flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!isApplying && selectedLeads.length > 0 && batchQuote) {
                                            applyBatchQuote();
                                        }
                                    }}
                                    disabled={isApplying || selectedLeads.length === 0 || !batchQuote}
                                    className={`btn btn-primary whitespace-nowrap ${isApplying || selectedLeads.length === 0 || !batchQuote ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ marginTop: 0 }}
                                >
                                    {isApplying ? 'Applying...' : `Apply to ${selectedLeads.length} Selected`}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!isDeleting && selectedLeads.length > 0) {
                                            handleDeleteLeads();
                                        }
                                    }}
                                    disabled={isDeleting || selectedLeads.length === 0}
                                    className={`btn whitespace-nowrap ${isDeleting || selectedLeads.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ 
                                        marginTop: 0,
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                                    }}
                                >
                                    {isDeleting ? 'Deleting...' : `Delete ${selectedLeads.length} Selected`}
                                </button>
                            </form>
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
                                        <th className="px-6 py-3">Quote</th>
                                        <th className="px-6 py-3 pr-8">Send Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {leads.map((lead) => (
                                        <tr 
                                            key={lead.id} 
                                            className={`hover:bg-slate-800/50 transition-colors ${
                                                glowingLeads.has(lead.id) ? 'glow-effect' : ''
                                            }`}
                                        >
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
                                            <td className="px-6 py-3">
                                                {lead.quoted_price ? `£${parseFloat(lead.quoted_price).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-3 pr-8">
                                                <button
                                                    onClick={() => handleSendEmail(lead)}
                                                    disabled={sendingEmails.has(lead.id) || !lead.quoted_price || !lead.client_email}
                                                    className={`text-sm px-3 py-1 rounded ${
                                                        sendingEmails.has(lead.id) || !lead.quoted_price || !lead.client_email
                                                            ? 'opacity-50 cursor-not-allowed text-slate-500'
                                                            : 'text-sky-400 hover:text-sky-300 hover:bg-sky-400/10'
                                                    } transition-colors`}
                                                >
                                                    {sendingEmails.has(lead.id) ? 'Sending...' : 'Send Email'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500 pl-8 pr-8">No leads found.</td>
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
                                        <th className="px-6 py-3">Expiry</th>
                                        <th className="px-6 py-3 pr-8">Quote</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                                    {bookings.map((booking) => (
                                        <tr 
                                            key={booking.id} 
                                            onClick={() => handleBookingRowClick(booking)}
                                            className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-3 pl-8">{new Date(booking.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-white">{booking.leads?.client_email || '-'}</td>
                                            <td className="px-6 py-3">{booking.leads?.address || '-'}</td>
                                            <td className="px-6 py-3">{booking.leads?.expiry_date || '-'}</td>
                                            <td className="px-6 py-3 pr-8">
                                                {booking.leads?.quoted_price ? `£${parseFloat(booking.leads.quoted_price).toFixed(2)}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500 pl-8 pr-8">No confirmed bookings found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Booking Details Modal */}
            {showBookingModal && selectedBooking && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={closeBookingModal}
                >
                    <div 
                        className="bg-slate-800 rounded-lg border border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Booking Details</h3>
                            <button
                                onClick={closeBookingModal}
                                className="text-slate-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-5 space-y-5">
                            {/* Property Details */}
                            <div>
                                <h4 className="text-base font-semibold text-sky-400 mb-3">Property Information</h4>
                                <div className="space-y-2.5 bg-slate-900/50 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <span className="text-slate-400 text-sm">Address:</span>
                                        <span className="text-white font-medium text-right max-w-[60%]">{selectedBooking.leads?.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Client Email:</span>
                                        <span className="text-white text-sm">{selectedBooking.leads?.client_email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Certificate Expiry:</span>
                                        <span className="text-white text-sm">{selectedBooking.leads?.expiry_date || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Quote:</span>
                                        <span className="text-white font-semibold text-sm">
                                            {selectedBooking.leads?.quoted_price ? `£${parseFloat(selectedBooking.leads.quoted_price).toFixed(2)}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Booking Date:</span>
                                        <span className="text-white text-sm">{new Date(selectedBooking.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="border-t border-slate-700 pt-5">
                                <h4 className="text-base font-semibold text-green-400 mb-3">Contact Details</h4>
                                <div className="space-y-2.5 bg-slate-900/50 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Contact Name:</span>
                                        <span className="text-white text-sm">{selectedBooking.contact_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Contact Phone:</span>
                                        <span className="text-white text-sm">{selectedBooking.contact_phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 text-sm">Contact Email:</span>
                                        <span className="text-white text-sm">{selectedBooking.contact_email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-700 flex gap-3">
                            <button
                                onClick={() => copyBookingDetails(selectedBooking)}
                                className="btn btn-primary flex-1"
                                style={{ marginTop: 0 }}
                            >
                                Copy All Details
                            </button>
                            <button
                                onClick={closeBookingModal}
                                className="btn flex-1"
                                style={{ 
                                    marginTop: 0,
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.3)',
                                    color: '#cbd5e1'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
