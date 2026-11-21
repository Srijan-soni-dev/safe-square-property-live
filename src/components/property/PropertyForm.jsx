import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield } from "lucide-react";
import FormField from "@/components/common/FormField";
import AmenitiesSection from "@/components/property/AmenitiesSection";
import LocationCapture from "@/components/property/LocationCapture";
import MediaUploader from "@/components/property/MediaUploader";
import NearbySection from "@/components/property/NearbySection";
import ToggleField from "@/components/property/ToggleField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MAX_MEDIA_FILES, PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/constants";
import { formatPriceShort } from "@/lib/format";
import { getMediaList, validateMediaFile } from "@/lib/media";
import { emptyPropertyValues, propertySchema } from "@/schemas/propertySchema";
import { toFormValues } from "@/services/propertyService";

function Section({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

/**
 * Shared by Add and Edit.
 * onSubmit(values, { keptMedia: [{url,type}], newItems: [{id,file,mime,kind}] })
 */
export default function PropertyForm({ property, onSubmit, submitting, submitLabel, uploadProgress }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: property ? toFormValues(property) : emptyPropertyValues,
  });

  const [kept, setKept] = useState(() => getMediaList(property));
  const [newItems, setNewItems] = useState([]);
  const [mediaError, setMediaError] = useState("");

  const itemsRef = useRef(newItems);
  itemsRef.current = newItems;
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)), []);

  const pricePreview = formatPriceShort(watch("price"));

  function addFiles(fileList) {
    const problems = [];
    const accepted = [];
    let room = MAX_MEDIA_FILES - kept.length - newItems.length;
    for (const file of Array.from(fileList)) {
      const check = validateMediaFile(file);
      if (check.error) {
        problems.push(check.error);
        continue;
      }
      if (room <= 0) {
        problems.push(`You can add up to ${MAX_MEDIA_FILES} files per property.`);
        break;
      }
      accepted.push({ id: crypto.randomUUID(), file, mime: check.mime, kind: check.kind, preview: URL.createObjectURL(file) });
      room--;
    }
    setMediaError(problems.join(" "));
    if (accepted.length) setNewItems((prev) => [...prev, ...accepted]);
  }

  function removeNew(id) {
    setNewItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  const submit = handleSubmit((values) => onSubmit(values, { keptMedia: kept, newItems }));

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Section title="Basic details" description="What the property is and where it stands.">
        <FormField label="Property title" htmlFor="title" required error={errors.title?.message} className="sm:col-span-2">
          <Input id="title" placeholder="e.g. 3 BHK house near City Center" aria-invalid={!!errors.title} {...register("title")} />
        </FormField>
        <FormField label="Property type" htmlFor="propertyType" required error={errors.propertyType?.message}>
          <Select id="propertyType" aria-invalid={!!errors.propertyType} {...register("propertyType")}>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </FormField>
        <FormField label="Status" htmlFor="status" required error={errors.status?.message}>
          <Select id="status" aria-invalid={!!errors.status} {...register("status")}>
            {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Number of Floors" htmlFor="numberOfFloors" error={errors.numberOfFloors?.message} hint="Whole number. Leave blank for plots.">
          <Input id="numberOfFloors" type="number" min="0" max="200" step="1" inputMode="numeric" placeholder="e.g. 2" aria-invalid={!!errors.numberOfFloors} {...register("numberOfFloors")} />
        </FormField>
        <div className="flex items-start sm:pt-[26px]">
          <ToggleField
            control={control}
            name="hasBoundary"
            label="Property Boundary Available"
            description="Boundary wall, fencing or clearly defined limits"
            icon={Shield}
            className="w-full"
          />
        </div>
      </Section>

      <Section title="Price and size">
        <FormField label="Price (₹)" htmlFor="price" required error={errors.price?.message} hint={pricePreview ? `That is ${pricePreview}` : "Enter the full amount in rupees"}>
          <Input id="price" type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 4500000" aria-invalid={!!errors.price} {...register("price")} />
        </FormField>
        <FormField label="Area (sq ft)" htmlFor="area" required error={errors.area?.message}>
          <Input id="area" type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 1200" aria-invalid={!!errors.area} {...register("area")} />
        </FormField>
      </Section>

      <Section title="Location">
        <FormField label="Locality" htmlFor="location" required error={errors.location?.message} hint="Area or neighbourhood, used for search">
          <Input id="location" placeholder="e.g. Thatipur, Gwalior" aria-invalid={!!errors.location} {...register("location")} />
        </FormField>
        <FormField label="Complete address" htmlFor="address" required error={errors.address?.message}>
          <Textarea id="address" rows={3} placeholder="House / plot number, street, landmark, city, pincode" aria-invalid={!!errors.address} {...register("address")} />
        </FormField>
        <FormField label="Description" htmlFor="description" error={errors.description?.message} className="sm:col-span-2">
          <Textarea id="description" rows={4} placeholder="Facing, condition and anything a buyer should know" aria-invalid={!!errors.description} {...register("description")} />
        </FormField>
      </Section>

      <LocationCapture register={register} errors={errors} watch={watch} setValue={setValue} />

      <AmenitiesSection control={control} register={register} />

      <NearbySection register={register} errors={errors} />

      <Section title="Owner and follow-up" description="Private notes for you. These are never shown publicly.">
        <FormField label="Owner name" htmlFor="ownerName" required error={errors.ownerName?.message}>
          <Input id="ownerName" autoComplete="off" aria-invalid={!!errors.ownerName} {...register("ownerName")} />
        </FormField>
        <FormField label="Owner phone number" htmlFor="ownerPhone" error={errors.ownerPhone?.message}>
          <Input id="ownerPhone" type="tel" autoComplete="off" placeholder="+91 98765 43210" aria-invalid={!!errors.ownerPhone} {...register("ownerPhone")} />
        </FormField>
        <FormField label="Additional contact number" htmlFor="additionalContactNumber" error={errors.additionalContactNumber?.message} hint="Family member, broker or alternate number">
          <Input id="additionalContactNumber" type="tel" autoComplete="off" placeholder="+91 91234 56789" aria-invalid={!!errors.additionalContactNumber} {...register("additionalContactNumber")} />
        </FormField>
        <FormField label="Last follow-up date" htmlFor="followUpDate" error={errors.followUpDate?.message}>
          <Input id="followUpDate" type="date" {...register("followUpDate")} />
        </FormField>
        <FormField label="Property notes" htmlFor="notes" error={errors.notes?.message} className="sm:col-span-2">
          <Textarea id="notes" rows={3} placeholder="Negotiation status, owner expectations, documents pending" aria-invalid={!!errors.notes} {...register("notes")} />
        </FormField>
      </Section>

      <Card>
        <CardHeader>
          <CardTitle>Photos and videos</CardTitle>
          <CardDescription>The first photo is used as the cover. Files upload when you save.</CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUploader
            existing={kept}
            newItems={newItems}
            onAddFiles={addFiles}
            onRemoveExisting={(url) => setKept((k) => k.filter((m) => m.url !== url))}
            onRemoveNew={removeNew}
            error={mediaError}
            disabled={submitting}
            uploading={submitting}
            progress={uploadProgress}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" size="lg" disabled={submitting}>
          <Link to="/properties">Cancel</Link>
        </Button>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Saving" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
