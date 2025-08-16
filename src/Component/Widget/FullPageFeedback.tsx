import FeedbackForm from "./FeedbackForm";
import "./Widget.css";

type Props = {
  onClose: () => void;
};

export default function FullPageFeedback({ onClose }: Props) {
  return (
    <div className="full-page-feedback ">
      <FeedbackForm onClose={onClose} />
    </div>
  );
}
