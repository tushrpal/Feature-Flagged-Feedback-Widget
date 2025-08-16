import { act, render, screen, waitFor } from "@testing-library/react";
import {
  FeatureFlagProvider,
  useFeatureFlags,
} from "../../src/context/FeatureFlagContext";

// ✅ mock the API module
jest.mock("../../src/api/mockApi", () => ({
  fetchFeatureFlags: jest.fn(),
}));

import { fetchFeatureFlags } from "../../src/api/mockApi";

const TestComponent = () => {
  const flags = useFeatureFlags();
  return (
    <div>
      <span data-testid="emailRequired">
        {flags.emailRequired ? "true" : "false"}
      </span>
      <span data-testid="darkMode">{flags.darkMode ? "true" : "false"}</span>
    </div>
  );
};

describe("FeatureFlagProvider", () => {
  beforeEach(() => jest.resetAllMocks());

  test("updates flags after fetchFeatureFlags resolves", async () => {
    (fetchFeatureFlags as jest.Mock).mockResolvedValue({
      emailRequired: true,
      darkMode: true,
    });

    await act(async () => {
      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );
    });

    await waitFor(() =>
      expect(screen.getByTestId("emailRequired")).toHaveTextContent("true")
    );
    expect(screen.getByTestId("darkMode")).toHaveTextContent("true");
  });

  test("updates flags after fetchFeatureFlags resolves", async () => {
    (fetchFeatureFlags as jest.Mock).mockResolvedValue({
      emailRequired: true,
      darkMode: true,
    });

    render(
      <FeatureFlagProvider>
        <TestComponent />
      </FeatureFlagProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("emailRequired")).toHaveTextContent("true")
    );
    expect(screen.getByTestId("darkMode")).toHaveTextContent("true");
  });

  test("throws error if useFeatureFlags used outside provider", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      /useFeatureFlags must be inside provider/i
    );
    consoleError.mockRestore();
  });
});
