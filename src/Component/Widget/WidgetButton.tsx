import { MessageSquareHeart } from "lucide-react";
import "./Widget.css";

type Props = {
  onWidgetClick: () => void;
};

export default function WidgetButton({ onWidgetClick }: Props) {
  return (
    <button
      onClick={onWidgetClick}
      className="widget-button"
      data-testid="widget-button"
      aria-label="Open feedback form"
    >
      <MessageSquareHeart />
    </button>
  );
}
