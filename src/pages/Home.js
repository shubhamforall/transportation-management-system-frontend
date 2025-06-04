import React from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import delivery from '../assets/delivery.svg';
import tracking from '../assets/tracking.svg';
import support from '../assets/support.svg';
import bannerTruck from '../assets/truck_banner.jpg';
import truckAbout from '../assets/truck_about.jfif';

export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-[600px]"
        style={{ backgroundImage: `url(${bannerTruck})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Reliable Trailer Transportation</h1>
          <p className="text-lg md:text-xl mb-2 max-w-2xl">
            We specialize in seamless delivery of freight and logistics nationwide. Trust us for fast, secure, and professional service with real-time tracking.
          </p>
          <p className="text-md md:text-lg mb-6 max-w-2xl">
            Manage your operations with ease through our powerful admin dashboard for vehicles, invoices, and customers.
          </p>
          <div className="flex gap-4">
            <Button text="Get Started" className="bg-blue-600 text-white hover:bg-blue-700" />
            <Button text="Admin Login" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => window.location.href = '/login'} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900 text-black">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <Card icon={delivery} title="Fast Delivery" description="We ensure your goods reach their destination quickly and safely." />
          <Card icon={tracking} title="Real-time Tracking" description="Track your shipment in real-time with our advanced system." />
          <Card icon={support} title="24/7 Support" description="Our team is available round the clock to assist you." />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-yellow-100">
        <div className="container mx-auto px-4 md:flex items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img src={truckAbout} alt="About Truck" className="rounded-3xl shadow-xl border-4 border-white max-w-full md:max-w-[90%]" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">About Our Transportation Services</h2>
            <p className="text-lg text-gray-700 mb-4">
              Our fleet of white and yellow trucks are equipped to serve you with top-level reliability. Whether you're delivering goods across the city or across states, we ensure it's on time.
            </p>
            <p className="text-lg text-gray-700">
              With the help of our intuitive admin panel, managing customers, invoices, and fleet operations has never been easier.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-xl bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contact Us</h2>
          <form className="space-y-6">
            <Input type="text" placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
            <Input type="text" placeholder="Subject" required />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
              required
            ></textarea>
            <Button text="Send Message" className="w-full bg-blue-600 text-white hover:bg-blue-700" />
          </form>
        </div>
      </section>
    </div>
  );
}
