import { useNotification } from "./useNotification";

const usePYModels = () => {
  const { NotificationHandler } = useNotification();

  const predictSmokerDrinker = async (dataset) => {
    console.log(dataset);
    if (dataset.length == 0) {
      dataset = [];
    }
    try {
      const response = await fetch(
        `http://localhost:8501/predictSmokerDrinker`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataset: dataset,
          }),
        }
      );
      const data = await response.json();
      if (data.status == data.status) {
        NotificationHandler(data.title, data.message, data.status);
      }
      return data.about;
    } catch (error) {
      console.log(error.message);
      NotificationHandler("Error", "Predictions failed to work.", "Error");
      const about = [
        {
          models: {
            smoking: {
              result: "",
              probability: "",
            },
            drinking: {
              result: "",
              probability: "",
            },
          },
        },
      ];
      return about;
    }
  };
  return { predictSmokerDrinker };
};
export default usePYModels;
