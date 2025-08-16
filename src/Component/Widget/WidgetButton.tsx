import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import "./Widget.css";
import msgGif from "../../assets/message-square-heart_1.gif";

type Props = {
  onWidgetClick: () => void;
};

export default function WidgetButton({ onWidgetClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onWidgetClick}
      className="widget-button"
      data-testid="widget-button"
      aria-label="Open feedback form"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? (
        <img src={msgGif} alt="heart message gif" className="icon-gif" />
      ) : (
        <MessageSquareHeart />
      )}
    </button>
  );
}
