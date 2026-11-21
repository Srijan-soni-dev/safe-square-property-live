import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle2, KeyRound, Plus, Tag } from "lucide-react";
import ErrorState from "@/components/common/ErrorState";
import PageHeader from "@/components/common/PageHeader";
import RecentProperties from "@/components/dashboard/RecentProperties";
import StatCard from "@/components/dashboard/StatCard";
import StatusBar from "@/components/dashboard/StatusBar";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { fetchDashboardData } from "@/services/propertyService";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchDashboardData());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = data?.stats ?? { total: 0, available: 0, sold: 0, rented: 0 };

  return (
    <>
      <PageHeader title="Dashboard" description="A quick look at your property records.">
        <Button asChild><Link to="/properties/new"><Plus /> Add property</Link></Button>
      </PageHeader>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total properties" value={stats.total} icon={Building2} tone="primary" loading={loading} />
            <StatCard label="Available" value={stats.available} icon={CheckCircle2} tone="emerald" loading={loading} />
            <StatCard label="Sold" value={stats.sold} icon={Tag} tone="slate" loading={loading} />
            <StatCard label="Rented" value={stats.rented} icon={KeyRound} tone="amber" loading={loading} />
          </div>
          {!loading && <StatusBar stats={stats} />}
          <RecentProperties properties={data?.recent ?? []} loading={loading} />
        </div>
      )}
    </>
  );
}
