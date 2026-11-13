import { Link } from 'react-router-dom';
import { Heart, Building2, Truck, CheckCircle, Leaf, Zap, Shield, ArrowRight } from 'lucide-react';

function Step({ number, icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="relative mb-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <Icon className="h-8 w-8 text-green-600" />
        </div>
        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/src/assets/hero.png')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            <Leaf className="h-4 w-4" /> Sustainable Food Sharing Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Reduce Food Waste.<br />
            <span className="text-green-200">Feed Lives.</span>
          </h1>
          <p className="max-w-2xl text-green-100 text-lg">
            Connect food donors with NGOs and volunteers to rescue surplus food and
            deliver it to those who need it most. Every meal saved is a life touched.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Browse Food
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '1,000+', label: 'Food Donations' },
              { value: '50+', label: 'Registered NGOs' },
              { value: '5,000+', label: 'Meals Saved' },
              { value: '100+', label: 'Volunteers' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-green-700">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              A simple 4-step process to connect surplus food with those who need it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Step number={1} icon={Heart} title="Donors List Food" description="Restaurants, homes, and businesses list their surplus food with quantity and pickup details." />
            <Step number={2} icon={Building2} title="NGOs Request" description="Registered NGOs browse available food and request what their beneficiaries need." />
            <Step number={3} icon={Truck} title="Volunteers Collect" description="Volunteers pick up approved donations and deliver them to NGOs or distribution points." />
            <Step number={4} icon={CheckCircle} title="Impact Tracked" description="Every donation is tracked end-to-end so you can see your real impact in real time." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why FoodShare?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature icon={Zap} title="Real-Time Updates" description="Instant notifications when food is listed, requested, or collected — no delays." />
            <Feature icon={Shield} title="Verified NGOs" description="All NGOs are admin-verified to ensure food reaches genuine beneficiaries." />
            <Feature icon={Leaf} title="Zero Waste Mission" description="Every listing reduces landfill food waste and lowers your carbon footprint." />
            <Feature icon={CheckCircle} title="End-to-End Tracking" description="Track every donation from listing to delivery with a full status timeline." />
            <Feature icon={Building2} title="Multi-Role Platform" description="Donors, NGOs, volunteers, and admins each get a tailored dashboard." />
            <Feature icon={Heart} title="Community Impact" description="See aggregated stats on meals saved, NGOs served, and communities fed." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of donors, NGOs, and volunteers reducing food waste across India.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
          >
            Join FoodShare <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

