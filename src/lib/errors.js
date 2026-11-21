export function getErrorMessage(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("row-level security") || msg.includes("permission denied"))
    return "You don't have permission to do that. Run the SQL files and sign in again.";
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "Can't reach the server. Check your internet connection and try again.";
  if (msg.includes("mime") || msg.includes("not allowed"))
    return "That file type isn't allowed. Use JPG, PNG, WebP, MP4, MOV or WEBM.";
  if (msg.includes("exceeded") || msg.includes("too large") || msg.includes("payload") || msg.includes("413"))
    return "A file is larger than your Supabase storage limit. Check Storage settings (the Free plan allows 50 MB per file).";
  if (msg.includes("bucket not found"))
    return "Storage bucket 'property-images' was not found. Run the Step 5 SQL.";
  if (msg.includes("column") && msg.includes("does not exist"))
    return "Database is missing the new columns. Run step7_migration.sql in the Supabase SQL Editor.";
  return error?.message || "Something went wrong. Please try again.";
}
