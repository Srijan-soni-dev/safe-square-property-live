import { useCallback, useEffect, useState } from "react";
import { fetchProperties } from "@/services/propertyService";
import { getErrorMessage } from "@/lib/errors";

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProperties(await fetchProperties());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { properties, setProperties, loading, error, reload: load };
}
