/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import About from './components/About';
import Booking from './components/Booking';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Services />
        <About />
        <Booking />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
