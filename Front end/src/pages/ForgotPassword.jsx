import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../api/auth';
import { toast } from '../components/common/Toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email address'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">Email Sent!</p>
              <p className="text-sm text-gray-500 mt-2">
                Check your inbox at <span className="font-medium">{email}</span> for a password reset link.
              </p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                error={error}
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Send Reset Link
              </Button>
              <Link to="/login" className="text-center text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

