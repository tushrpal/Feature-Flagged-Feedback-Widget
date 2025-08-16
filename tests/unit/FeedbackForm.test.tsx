import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackForm from "../../src/Component/Widget/FeedbackForm";

jest.mock("../../src/api/mockApi", () => ({
  submitFeedback: jest.fn(),
  fetchFeatureFlags: jest.fn().mockResolvedValue({ newUI: true }),
}));

import { submitFeedback } from "../../src/api/mockApi";
import { FeatureFlagProvider } from "../../src/context/FeatureFlagContext";
// Utility to wrap component in provider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<FeatureFlagProvider>{ui}</FeatureFlagProvider>);
};

test("shows error when message is empty", async () => {
  renderWithProvider(<FeedbackForm onClose={jest.fn()} isExpanded={true} />);
  userEvent.click(screen.getByText(/submit/i));
  expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
});

test("shows error when message is empty", async () => {
  renderWithProvider(<FeedbackForm onClose={jest.fn()} isExpanded={true} />);

  const messageInput = screen.getByPlaceholderText(/enter your feedback/i);

  // clear the value first so RHF sees it as empty
  await userEvent.clear(messageInput);

  // then click submit
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  // expect the error message
  expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
});

test("draft persists in localStorage", async () => {
  // Initial render
  const { unmount } = renderWithProvider(
    <FeedbackForm onClose={jest.fn()} isExpanded={true} />
  );

  const nameInput = screen.getByPlaceholderText(/enter your name/i);
  const messageInput = screen.getByPlaceholderText(/enter your feedback/i);

  // Type into inputs
  await userEvent.type(nameInput, "John");
  await userEvent.type(messageInput, "This is a draft");

  // Check localStorage
  const draft = JSON.parse(localStorage.getItem("feedback-draft") || "{}");
  expect(draft.name).toBe("John");
  expect(draft.message).toBe("This is a draft");

  // Clean up previous render
  unmount();

  // Re-render to simulate reload
  renderWithProvider(<FeedbackForm onClose={jest.fn()} isExpanded={true} />);

  expect(screen.getByPlaceholderText(/enter your name/i)).toHaveValue("John");
  expect(screen.getByPlaceholderText(/enter your feedback/i)).toHaveValue(
    "This is a draft"
  );

  // Optional: cleanup after test
  cleanup();
});

test("clears draft from localStorage after submit", async () => {
  (submitFeedback as jest.Mock).mockResolvedValue({}); // mock API success

  renderWithProvider(<FeedbackForm onClose={jest.fn()} isExpanded={true} />);

  const nameInput = screen.getByPlaceholderText(/enter your name/i);
  const messageInput = screen.getByPlaceholderText(/enter your feedback/i);

  await userEvent.type(nameInput, "John");
  await userEvent.type(messageInput, "This is a draft");

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(localStorage.getItem("feedback-draft")).toBeNull();
  });
});
