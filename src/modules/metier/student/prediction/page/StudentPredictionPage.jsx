import {
  useEffect,
  useState,
} from "react";

import {
  getMyPrediction,
} from "../services/predictionService";

export default function StudentPredictionPage() {
  const [
    prediction,
    setPrediction,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPrediction =
      async () => {
        try {
          setLoading(true);

          const data =
            await getMyPrediction();

          setPrediction(data);
        } catch (error) {
          console.error(error);

          setError(
            "Impossible de charger la prédiction."
          );
        } finally {
          setLoading(false);
        }
      };

    loadPrediction();
  }, []);

  if (loading) {
    return (
      <p>
        Chargement...
      </p>
    );
  }

  if (error) {
    return (
      <p>
        {error}
      </p>
    );
  }

  return (
    <div>
      <h1>
        Ma prédiction
      </h1>

      <pre>
        {JSON.stringify(
          prediction,
          null,
          2
        )}
      </pre>
    </div>
  );
}