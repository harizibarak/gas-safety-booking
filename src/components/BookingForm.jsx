import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function BookingForm() {
    const [formData, setFormData] = useState({
        expiryDate: null,
        address: '',
        clientEmail: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                        status: 'lead'
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            console.log('Lead submitted successfully');
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="card fade-in flex flex-col items-center justify-center text-center py-16">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <FaCheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Details Received!</h2>
                <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto">
                    Thank you. We have recorded your certificate expiry. We will contact you at <strong className="text-sky-400">{formData.clientEmail}</strong> when it's time to renew with a quote.
                </p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                            expiryDate: null,
                            address: '',
                            clientEmail: ''
                        });
                    }}
                    className="btn btn-primary"
                >
                    Add Another Property
                </button>
            </div>
        );
    }

    return (
        <div className="card fade-in relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-2xl !p-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600"></div>

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2 text-white">Register for Renewal</h2>
                <p className="text-slate-400">Enter your details to get a quote when your certificate is due.</p>
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
                        'Submit Details'
                    )}
                </button>
            </form>
        </div>
    );
}
