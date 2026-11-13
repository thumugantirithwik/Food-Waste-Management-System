import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCategories } from '../../api/analytics';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  '#16a34a', '#2563eb', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#db2777', '#65a30d',
];

export default function CategoryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setData(res.data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (data.length === 0) {
    return <EmptyState icon={PieIcon} title="No category data" />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ category, percent }) =>
            `${category} (${(percent * 100).toFixed(0)}%)`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(val, name) => [val, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

