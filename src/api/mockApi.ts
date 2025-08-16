export async function fetchFeatureFlags() {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));
  return {
    emailRequired: true,
    darkMode: false,
  };
}

export async function submitFeedback(data: any) {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
   console.log(data);
  // Simulate random failure 10%
  const failed = Math.random() < 0.1;
  if (failed) {
    throw new Error("Submission failed");
  }

  return { message: "Success" };
}
