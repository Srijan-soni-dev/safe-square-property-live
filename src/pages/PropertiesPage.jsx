import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ChevronLeft, ChevronRight, Plus, SearchX } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageHeader from "@/components/common/PageHeader";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyTable from "@/components/property/PropertyTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { applyFilters, countActiveFilters, defaultFilters } from "@/lib/filterProperties";
import { useProperties } from "@/hooks/useProperties";
import { useToast } from "@/hooks/useToast";
import { deleteProperty } from "@/services/propertyService";

export default function PropertiesPage() {
  const { properties, setProperties, loading, error, reload } = useProperties();
  const toast = useToast();

  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => applyFilters(properties, filters), [properties, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtering = countActiveFilters(filters) > 0;

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteProperty(toDelete);
      setProperties((list) => list.filter((p) => p.id !== toDelete.id));
      toast.success("Property deleted");
      setToDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="Properties" description={loading ? "Loading your records" : `${properties.length} ${properties.length === 1 ? "property" : "properties"} in your records`}>
        <Button asChild><Link to="/properties/new"><Plus /> Add property</Link></Button>
      </PageHeader>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="space-y-4">
          <PropertyFilters filters={filters} onChange={updateFilters} />

          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            {loading ? (
              <ul className="divide-y">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-12 w-16" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /></div>
                    <Skeleton className="hidden h-6 w-20 sm:block" />
                  </li>
                ))}
              </ul>
            ) : properties.length === 0 ? (
              <EmptyState icon={Building2} title="No properties yet" description="Your property records will appear here once you add them.">
                <Button asChild><Link to="/properties/new"><Plus /> Add your first property</Link></Button>
              </EmptyState>
            ) : filtered.length === 0 ? (
              <EmptyState icon={SearchX} title="No matching properties" description="Try a different search or clear the filters.">
                <Button variant="outline" onClick={() => updateFilters(defaultFilters)}>Clear filters</Button>
              </EmptyState>
            ) : (
              <PropertyTable properties={visible} onDelete={setToDelete} />
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
              <p>
                Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
                {filtering && ` (filtered from ${properties.length})`}
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(current - 1)} disabled={current === 1}><ChevronLeft /> Previous</Button>
                  <span>Page {current} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(current + 1)} disabled={current === totalPages}>Next <ChevronRight /></Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this property?"
        description={toDelete ? `"${toDelete.title}" and its images will be permanently deleted. This can't be undone.` : ""}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
