import {
  act,
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Widget from "../../src/Component/Widget/Widget";

jest.mock("../../src/Component/Widget/WidgetButton", () => ({
  __esModule: true,
  default: ({ onWidgetClick }: { onWidgetClick: () => void }) => (
    <button onClick={onWidgetClick}>MockButton</button>
  ),
}));

jest.mock("../../src/Component/Widget/FeedbackForm", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="feedback-form">
      MockFeedbackForm
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock("../../src/Component/Widget/FullPageFeedback", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="fullpage-feedback">
      MockFullPageFeedback
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("Widget", () => {
  beforeEach(() => {
    // default desktop
    act(() => {
      (window.innerWidth as number) = 1024;
      window.dispatchEvent(new Event("resize"));
    });
  });

  test("renders the WidgetButton always", () => {
    render(<Widget />);
    expect(screen.getByText("MockButton")).toBeInTheDocument();
  });

  test("opens FeedbackForm on desktop when button clicked", () => {
    render(<Widget />);
    fireEvent.click(screen.getByText("MockButton"));
    expect(screen.getByTestId("feedback-form")).toBeInTheDocument();
  });

  test("closes FeedbackForm when close button clicked", async () => {
    render(<Widget />);
    fireEvent.click(screen.getByText("MockButton")); // open
    fireEvent.click(screen.getByText("Close")); // close

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("feedback-form")
    );
  });

  test("opens FullPageFeedback on mobile", () => {
    act(() => {
      (window.innerWidth as number) = 500;
      window.dispatchEvent(new Event("resize"));
    });

    render(<Widget />);
    fireEvent.click(screen.getByText("MockButton"));
    expect(screen.getByTestId("fullpage-feedback")).toBeInTheDocument();
  });

  test("collapses when clicking button twice", async () => {
    render(<Widget />);
    fireEvent.click(screen.getByText("MockButton")); // open expanded
    fireEvent.click(screen.getByText("MockButton")); // close

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId("feedback-form")
    );
  });
});
