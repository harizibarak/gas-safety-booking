import { useState } from 'react'
import BookingForm from './components/BookingForm'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg space-y-10 fade-in relative z-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-color), #60a5fa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Gas Safety
            </span>{' '}
            Booking
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
            Secure your property's safety with our certified inspection services. Fast, reliable, and fully compliant.
          </p>
        </div>

        <BookingForm />

        <footer className="text-center text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} TSHUA Property Investments LTD. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default App
