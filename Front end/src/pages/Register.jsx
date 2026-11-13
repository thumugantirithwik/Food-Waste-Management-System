import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/common/Toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ROLES = [
  { value: 'donor', label: 'Food Donor', desc: 'Restaurants, homes, businesses with surplus food' },
  { value: 'ngo', label: 'NGO / Organization', desc: 'Charities and organizations serving beneficiaries' },
  { value: 'volunteer', label: 'Volunteer', desc: 'Help collect and deliver food donations' },
];

function PasswordStrength({ password }) {
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  if (!password) return null;
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500">Strength: {labels[strength]}</p>
    </div>
  );
}

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'donor', organizationName: '', organizationRegNo: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid Indian mobile number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.role === 'ngo' && !form.organizationName) e.organizationName = 'Organization name is required';
    if (!agreed) e.terms = 'You must accept the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: form.role,
      };
      if (form.role === 'ngo') {
        payload.organizationName = form.organizationName;
        payload.organizationRegNo = form.organizationRegNo;
      }
      const res = await registerApi(payload);
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to FoodShare.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🍱</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">Join FoodShare</h1>
            <p className="text-gray-500 text-sm mt-1">Create your account and start making an impact</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">I am a...</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setForm((f) => ({ ...f, role: r.value })); }}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${
                      form.role === r.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900">{r.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Input label="Full Name" type="text" placeholder="Ravi Kumar" value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
            <Input label="Phone Number" type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} error={errors.phone} hint="Indian mobile number (10 digits, starts with 6-9)" />

            {form.role === 'ngo' && (
              <>
                <Input label="Organization Name" type="text" placeholder="Hope Foundation" value={form.organizationName} onChange={set('organizationName')} error={errors.organizationName} />
                <Input label="Registration Number (optional)" type="text" placeholder="NGO/REG/2023/001" value={form.organizationRegNo} onChange={set('organizationRegNo')} />
              </>
            )}

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
            />

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <span className="text-green-600 font-medium">Terms of Service</span> and{' '}
                  <span className="text-green-600 font-medium">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-600 mt-1">{errors.terms}</p>}
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

