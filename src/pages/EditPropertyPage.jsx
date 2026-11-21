import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2 } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageHeader from "@/components/common/PageHeader";
import PropertyForm from "@/components/property/PropertyForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useProperty } from "@/hooks/useProperty";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";
import { updateProperty } from "@/services/propertyService";

export default function EditPropertyPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { property, loading, error, reload } = useProperty(id);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({});

  async function handleSubmit(values, { keptMedia, newItems }) {
    setSubmitting(true);
    setProgress({});
    try {
      await updateProperty({
        userId: user.id,
        property,
        values,
        keptMedia,
        items: newItems,
        onProgress: (itemId, pct) => setProgress((p) => ({ ...p, [itemId]: pct })),
      });
      toast.success("Property updated");
      navigate(`/properties/${property.id}`, { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit property" description={property?.title} />
      {loading ? (
        <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !property ? (
        <div className="rounded-lg border bg-card">
          <EmptyState icon={Building2} title="Property not found" description="It may have been deleted.">
            <Button asChild><Link to="/properties">Back to properties</Link></Button>
          </EmptyState>
        </div>
      ) : (
        <PropertyForm property={property} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" uploadProgress={progress} />
      )}
    </div>
  );
}
