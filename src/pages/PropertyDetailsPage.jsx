import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CalendarClock, Layers, MapPin, Pencil, Phone, PhoneCall, Ruler, Shield, Trash2, User } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import StatusBadge from "@/components/common/StatusBadge";
import AmenitiesCard from "@/components/property/AmenitiesCard";
import LocationCard from "@/components/property/LocationCard";
import MediaGallery from "@/components/property/MediaGallery";
import NearbyCard from "@/components/property/NearbyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperty } from "@/hooks/useProperty";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";
import { formatArea, formatDate, formatPrice } from "@/lib/format";
import { getMediaList } from "@/lib/media";
import { deleteProperty } from "@/services/propertyService";

function Info({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <div className="break-words text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}

function PhoneLink({ number }) {
  if (!number) return "—";
  return <a href={`tel:${number.replace(/\s/g, "")}`} className="text-primary hover:underline">{number}</a>;
}

function followUpNote(date) {
  if (!date) return null;
  const days = Math.floor((new Date(`${date}T00:00:00`) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)} day${days === -1 ? "" : "s"} ago`, className: "text-muted-foreground" };
  if (days === 0) return { text: "Today", className: "text-amber-600 dark:text-amber-400" };
  return { text: `In ${days} day${days === 1 ? "" : "s"}`, className: "text-muted-foreground" };
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { property, loading, error, reload } = useProperty(id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProperty(property);
      toast.success("Property deleted");
      navigate("/properties", { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e));
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 lg:grid-cols-5"><Skeleton className="h-80 lg:col-span-3" /><Skeleton className="h-80 lg:col-span-2" /></div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!property) {
    return (
      <div className="rounded-lg border bg-card">
        <EmptyState icon={Building2} title="Property not found" description="It may have been deleted.">
          <Button asChild><Link to="/properties">Back to properties</Link></Button>
        </EmptyState>
      </div>
    );
  }

  const follow = followUpNote(property.follow_up_date);
  const floors = property.number_of_floors;

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
        <Link to="/properties"><ArrowLeft /> All properties</Link>
      </Button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{property.title}</h1>
            <StatusBadge status={property.status} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {property.location || "Location not set"} · {property.property_type}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline"><Link to={`/properties/${property.id}/edit`}><Pencil /> Edit</Link></Button>
          <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <MediaGallery media={getMediaList(property)} title={property.title} />
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              {property.description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed">{property.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No description added.</p>
              )}
            </CardContent>
          </Card>
          <AmenitiesCard amenities={property.amenities} />
          <NearbyCard facilities={property.nearby_facilities} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Price</p>
                <p className="font-display text-3xl font-bold">{formatPrice(property.price)}</p>
              </div>
              <Info icon={Ruler} label="Area">{formatArea(property.area)}</Info>
              <Info icon={Building2} label="Property type">{property.property_type}</Info>
              <Info icon={Layers} label="Number of floors">{floors === null || floors === undefined ? "—" : floors}</Info>
              <Info icon={Shield} label="Property boundary available">
                <span className={property.has_boundary ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                  {property.has_boundary ? "Yes" : "No"}
                </span>
              </Info>
              <Info icon={MapPin} label="Complete address">{property.address || "—"}</Info>
            </CardContent>
          </Card>

          <LocationCard property={property} />

          <Card>
            <CardHeader><CardTitle>Owner and follow-up</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <Info icon={User} label="Owner name">{property.owner_name || "—"}</Info>
              <Info icon={Phone} label="Owner phone"><PhoneLink number={property.owner_phone} /></Info>
              <Info icon={PhoneCall} label="Additional contact number"><PhoneLink number={property.additional_contact_number} /></Info>
              <Info icon={CalendarClock} label="Last follow-up">
                {formatDate(property.follow_up_date)}
                {follow && <span className={`ml-2 text-xs font-normal ${follow.className}`}>{follow.text}</span>}
              </Info>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-line text-sm">{property.notes || <span className="text-muted-foreground">No notes.</span>}</p>
              </div>
              <p className="border-t pt-4 text-xs text-muted-foreground">
                Added {formatDate(property.created_at)} · Updated {formatDate(property.updated_at)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this property?"
        description={`"${property.title}" and all its photos and videos will be permanently deleted. This can't be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
