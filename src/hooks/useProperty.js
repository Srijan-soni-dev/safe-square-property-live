import { useCallback, useEffect, useState } from "react";
import { fetchPropertyById } from "@/services/propertyService";
import { getErrorMessage } from "@/lib/errors";

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProperty(await fetchPropertyById(id));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { property, loading, error, reload: load };
}
