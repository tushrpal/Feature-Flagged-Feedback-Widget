import HomePage from "./Component/Homapage/HomePage";
import Widget from "./Component/Widget/Widget";
import { useEffect } from "react";
import { useFeatureFlags } from "./context/FeatureFlagContext";

export default function App() {
  const flags = useFeatureFlags();

  useEffect(() => {
    if (flags.darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [flags.darkMode]);

  return (
    <>
      <HomePage />
      <Widget />
    </>
  );
}
