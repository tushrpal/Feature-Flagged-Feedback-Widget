import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDraftState } from "../../hooks/useDraftState";
import { useFeatureFlags } from "../../context/FeatureFlagContext";
import { submitFeedback } from "../../api/mockApi";

type FormData = {
  name: string;
  email: string;
  message: string;
  category: string;
};

type Props = {
  onClose: () => void;
  isExpanded?: boolean;
};

export default function FeedbackForm({ onClose, isExpanded }: Props) {
  const [submitError, setSubmitError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const flags = useFeatureFlags();
  const maxMessageLength = 500;
  const isDarkMode = flags.darkMode; // assuming this boolean exists

  const [draft, setDraft] = useDraftState<FormData>("feedback-draft", {
    name: "",
    email: "",
    message: "",
    category: "Bug",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: draft });

  const handleChange = (field: keyof FormData, value: string) => {
    setDraft({ ...draft, [field]: value });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSubmitError(false);
    try {
      await submitFeedback(data);
      setSubmitSuccess(true);
      reset();
      setDraft({ name: "", email: "", message: "", category: "Bug" });
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isExpanded) {
      setSubmitSuccess(false);
      setSubmitError(false);
    }
  }, [isExpanded]);

  // Focus trap + Esc support
  useEffect(() => {
    if (!isExpanded || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    first.focus({ preventScroll: true });

    return () => document.removeEventListener("keydown", handleKey);
  }, [isExpanded]);

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, #1f1f1f, #2c2c2c)"
            : "linear-gradient(135deg, #fff, #f7f7f7)",
          color: isDarkMode ? "#fff" : "#111",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: "480px",
          margin: "2rem auto",
          boxShadow: isDarkMode
            ? "0 20px 50px rgba(0,0,0,0.5)"
            : "0 20px 50px rgba(0,0,0,0.15)",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              ✅ Thank you for your feedback!
            </p>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                background: isDarkMode ? "#2c2c2c" : "#fff",
                color: isDarkMode ? "#fff" : "#111",
                outline: "none",
                transition: "border-color 0.2s, background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Close
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3
              style={{
                fontSize: "1.75rem",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Feedback
            </h3>

            {/* Name */}
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="name">Name </label>
              <input
                id="name"
                placeholder="Enter your name"
                {...register("name")}
                value={draft.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                  background: isDarkMode ? "#2c2c2c" : "#fff",
                  color: isDarkMode ? "#fff" : "#111",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s, color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#ec4899")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="Enter your email"
                {...register("email", {
                  required: flags.emailRequired ? "Email is required" : false,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                value={draft.email}
                onChange={(e) => {
                  handleChange("email", e.target.value);
                  setValue("email", e.target.value, { shouldValidate: true });
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                  background: isDarkMode ? "#2c2c2c" : "#fff",
                  color: isDarkMode ? "#fff" : "#111",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s, color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#a855f7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
              />
              {errors.email && (
                <p id="email-error" style={{ color: "#f87171" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="message">
                Message ({draft.message.length}/{maxMessageLength})
              </label>
              <textarea
                id="message"
                placeholder="Enter your feedback"
                {...register("message", {
                  required: "Message is required",
                  maxLength: {
                    value: maxMessageLength,
                    message: `Max ${maxMessageLength} characters`,
                  },
                })}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                value={draft.message}
                onChange={
                  (e) => {
                    handleChange(
                      "message",
                      e.target.value.slice(0, maxMessageLength)
                    );
                    setValue("message", e.target.value, {
                      shouldValidate: true,
                    });
                  } // update RHF
                }
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                  background: isDarkMode ? "#2c2c2c" : "#fff",
                  color: isDarkMode ? "#fff" : "#111",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s, color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#60a5fa")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
              />
              {errors.message && (
                <p id="message-error" style={{ color: "#f87171" }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                {...register("category")}
                value={draft.category}
                onChange={(e) => handleChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
                  background: isDarkMode ? "#2c2c2c" : "#fff",
                  color: isDarkMode ? "#fff" : "#111",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s, color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#facc15")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#444")}
              >
                <option>Bug</option>
                <option>Feature</option>
                <option>Other</option>
              </select>
            </div>

            {submitError && (
              <p style={{ color: "#f87171" }}>
                ❌ Submission failed. Please try again.
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  marginRight: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "999px",
                  background: isDarkMode
                    ? "linear-gradient(90deg,#ec4899,#a855f7)"
                    : "linear-gradient(to right, #ec4899, #a855f7)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: isDarkMode
                    ? "0 4px 12px rgba(236,72,153,0.3)"
                    : "0 4px 12px rgba(59,130,246,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {loading ? "Sending..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  marginLeft: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "999px",
                  background: isDarkMode ? "#1f1f1f" : "#f3f4f6",
                  color: isDarkMode ? "#fff" : "#111",
                  border: isDarkMode ? "1px solid #555" : "1px solid #ccc",

                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Close
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
