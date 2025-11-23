import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function BookingForm() {
    const [formData, setFormData] = useState({
        expiryDate: null,
        address: '',
        clientEmail: '',
        hasTenant: false,
        tenantName: '',
        tenantPhone: '',
        tenantEmail: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, expiryDate: date }));
        if (errors.expiryDate) {
            setErrors(prev => ({ ...prev, expiryDate: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.address.trim()) newErrors.address = 'Property address is required';
        if (!formData.clientEmail.trim()) {
            newErrors.clientEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
            newErrors.clientEmail = 'Please enter a valid email';
        }

        if (formData.hasTenant) {
            if (!formData.tenantName.trim()) newErrors.tenantName = 'Tenant name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('bookings')
                .insert([
                    {
                        expiry_date: formData.expiryDate,
                        address: formData.address,
                        client_email: formData.clientEmail,
                        has_tenant: formData.hasTenant,
                        tenant_name: formData.hasTenant ? formData.tenantName : null,
                        tenant_phone: formData.hasTenant ? formData.tenantPhone : null,
                        tenant_email: formData.hasTenant ? formData.tenantEmail : null
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="card fade-in text-center py-16">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <FaCheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Booking Received!</h2>
                <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto">
                    Thank you. We have received your inspection request. We will contact you shortly at <strong className="text-sky-400">{formData.clientEmail}</strong> to confirm the appointment.
                </p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                            expiryDate: null,
                            address: '',
                            clientEmail: '',
                            hasTenant: false,
                            tenantName: '',
                            tenantPhone: '',
                            tenantEmail: ''
                        });
                    }}
                    className="btn btn-primary"
                >
                    Book Another Property
                </button>
            </div>
        );
    }

    return (
        <div className="card fade-in relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-2xl !p-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600"></div>

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2 text-white">Book Inspection</h2>
                <p className="text-slate-400">Fill in the details below to schedule your certificate renewal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Certificate Expiry */}
                <div className="relative">
                    <label htmlFor="expiryDate" className="label">Current Certificate Expiry Date</label>
                    <div className="relative group">
                        <DatePicker
                            selected={formData.expiryDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            className={`input ${errors.expiryDate ? 'border-red-500/50 focus:border-red-500' : ''}`}
                            wrapperClassName="w-full"
                            minDate={new Date()}
                        />
                    </div>
                    {errors.expiryDate && <p className="text-red-400 text-sm mt-2 flex items-center"><span className="mr-1">•</span> {errors.expiryDate}</p>}
                </div>

                {/* Property Address */}
                <div className="relative">
                    <label htmlFor="address" className="label">Property Address</label>
                    <div className="relative group">
                        <textarea
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Example Street, London, UK"
                            className={`input px-4 py-3 resize-none ${errors.address ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                    </div>
                    {errors.address && <p className="text-red-400 text-sm mt-2 flex items-center"><span className="mr-1">•</span> {errors.address}</p>}
                </div>

                {/* Client Email */}
                <div className="relative">
                    <label htmlFor="clientEmail" className="label">Your Email Address</label>
                    <div className="relative group">
                        <input
                            type="email"
                            id="clientEmail"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`input ${errors.clientEmail ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                    </div>
                    {errors.clientEmail && <p className="text-red-400 text-sm mt-2 flex items-center"><span className="mr-1">•</span> {errors.clientEmail}</p>}
                </div>

                {/* Tenant Details Toggle */}
                <div className="tenant-toggle">
                    <label className="flex items-center justify-between cursor-pointer select-none">
                        <span className="text-sm font-medium text-slate-200">Is there a tenant currently in the property?</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="hasTenant"
                                checked={formData.hasTenant}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <div className={`block w-12 h-7 rounded-full transition-all duration-300 ${formData.hasTenant ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${formData.hasTenant ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                    </label>
                </div>

                {/* Tenant Details Section */}
                {formData.hasTenant && (
                    <div className="pl-6 border-sky-500/30 ml-2 space-y-8 fade-in pt-4 pb-2">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-sky-400 mb-4">Tenant Details</h3>

                        <div className="relative">
                            <label htmlFor="tenantName" className="label">Tenant Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="tenantName"
                                    name="tenantName"
                                    value={formData.tenantName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`input ${errors.tenantName ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                />
                            </div>
                            {errors.tenantName && <p className="text-red-400 text-sm mt-2 flex items-center"><span className="mr-1">•</span> {errors.tenantName}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="tenantPhone" className="label">Tenant Phone <span className="text-slate-500 font-normal ml-1">(Optional)</span></label>
                                <div className="relative group">
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
                            </div>

                            <div className="relative">
                                <label htmlFor="tenantEmail" className="label">Tenant Email <span className="text-slate-500 font-normal ml-1">(Optional)</span></label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="tenantEmail"
                                        name="tenantEmail"
                                        value={formData.tenantEmail}
                                        onChange={handleChange}
                                        placeholder="tenant@example.com"
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary w-full py-4 text-lg shadow-lg shadow-sky-500/20 mt-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Book Inspection'
                    )}
                </button>
            </form>
        </div>
    );
}
