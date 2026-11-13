/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getTrends } from '../../api/analytics';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { TrendingUp } from 'lucide-react';

export default function DonationTrendChart({ period = '30d' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getTrends(period)
      .then((res) => {
        setData(res.data.trends || []);
        setError(null);
      })
      .catch(() => setError('Failed to load trend data'))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <LoadingSpinner />;
  if (error || data.length === 0) {
    return <EmptyState icon={TrendingUp} title="No trend data" description="Data will appear as donations are made" />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Donations"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

