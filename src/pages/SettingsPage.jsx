import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Moon, Sun } from "lucide-react";
import FormField from "@/components/common/FormField";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";
import { passwordSchema } from "@/schemas/passwordSchema";
import { updatePassword } from "@/services/accountService";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { password: "", confirm: "" } });

  async function onSubmit({ password }) {
    setSaving(true);
    try {
      await updatePassword(password);
      toast.success("Password updated");
      reset();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Your account and display preferences." />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>The email you sign in with.</CardDescription>
        </CardHeader>
        <CardContent><p className="text-sm font-semibold">{user?.email}</p></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the dashboard looks.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} aria-pressed={theme === "light"}><Sun /> Light</Button>
          <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"}><Moon /> Dark</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField label="New password" htmlFor="password" error={errors.password?.message}>
              <Input id="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
            </FormField>
            <FormField label="Confirm new password" htmlFor="confirm" error={errors.confirm?.message}>
              <Input id="confirm" type="password" autoComplete="new-password" aria-invalid={!!errors.confirm} {...register("confirm")} />
            </FormField>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {saving ? "Updating" : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
