import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaCheckCircle } from 'react-icons/fa';

export default function BookingCompletion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [formData, setFormData] = useState({
        tenantName: '',
        tenantPhone: '',
        tenantEmail: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const contactNameRef = useRef(null);

    useEffect(() => {
        fetchBooking();
    }, [id]);

    useEffect(() => {
        if (!loading && booking && !isSuccess && contactNameRef.current) {
            contactNameRef.current.focus();
        }
    }, [loading, booking, isSuccess]);

    const fetchBooking = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data.status === 'confirmed') {
                setIsSuccess(true); // Already confirmed
            }
            setBooking(data);
        } catch (error) {
            console.error('Error fetching booking:', error);
            alert('Invalid booking link.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tenantName.trim()) {
            alert('Tenant Name is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('bookings')
                .update({
                    tenant_name: formData.tenantName,
                    tenant_phone: formData.tenantPhone,
                    tenant_email: formData.tenantEmail,
                    status: 'confirmed'
                })
                .eq('id', id);

            if (error) throw error;

            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to confirm booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card fade-in text-center py-16 max-w-lg w-full">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <FaCheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Booking Confirmed!</h2>
                    <p className="text-slate-400 mb-8 text-lg">
                        Thank you. We have received the tenant details and will proceed with the arrangement.
                    </p>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="card fade-in w-full max-w-lg relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-2xl !p-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600"></div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-2 text-white">Complete Your Booking</h2>
                    <p className="text-slate-400">Please provide contact details for the tenant or access contact.</p>
                </div>

                <div className="relative">
                    <label htmlFor="propertyAddress" className="label">Property Address</label>
                    <input
                        type="text"
                        id="propertyAddress"
                        value={booking.address}
                        disabled
                        className="input opacity-60 cursor-not-allowed"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="tenantName" className="label">Contact Name (Tenant/Agent)</label>
                        <input
                            type="text"
                            id="tenantName"
                            name="tenantName"
                            value={formData.tenantName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="input"
                            required
                            ref={contactNameRef}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="tenantPhone" className="label">Contact Phone</label>
                        <input
                            type="tel"
                            id="tenantPhone"
                            name="tenantPhone"
                            value={formData.tenantPhone}
                            onChange={handleChange}
                            placeholder="+44 7..."
                            className="input"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="tenantEmail" className="label">Contact Email</label>
                        <input
                            type="email"
                            id="tenantEmail"
                            name="tenantEmail"
                            value={formData.tenantEmail}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-primary w-full py-4 text-lg shadow-lg shadow-sky-500/20 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
