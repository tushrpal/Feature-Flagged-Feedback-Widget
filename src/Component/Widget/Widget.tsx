import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WidgetButton from "./WidgetButton";
import FeedbackForm from "./FeedbackForm";
import FullPageFeedback from "./FullPageFeedback";

type WidgetMode = "collapsed" | "expanded" | "full";

export default function Widget() {
  const [mode, setMode] = useState<WidgetMode>("collapsed");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const handleOpen = () => setMode(isMobile ? "full" : "expanded");
  const handleClose = () => setMode("collapsed");
  const onWidgetClick = () => {
    if (mode === "collapsed") {
      handleOpen();
    } else {
      handleClose();
    }
  };
  return (
    <>
      {/* Always render the button */}
      <WidgetButton onWidgetClick={onWidgetClick} />

      {/* AnimatePresence for the panel */}
      <AnimatePresence>
        {mode === "expanded" && (
          <motion.div
            className="feedback-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <FeedbackForm isExpanded={true} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full page for mobile */}
      <AnimatePresence>
        {mode === "full" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullPageFeedback onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
