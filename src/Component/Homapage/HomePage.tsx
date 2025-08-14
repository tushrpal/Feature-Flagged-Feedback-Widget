import { motion } from "framer-motion";
import { Heart, Smile, Brain } from "lucide-react";
import styles from "./HomePage.module.css";
import image from "../../assets/AuraLink.jpg";
import image2 from "../../assets/Hero_band.jpg";
// import image3 from "../../assets/Hero_band1.jpg";
const features = [
  {
    icon: <Heart size={32} color="#ec4899" />,
    title: "Emotional Awareness",
    description:
      "Understand your mood in real time through biometric sensors and AI-powered analysis.",
  },
  {
    icon: <Smile size={32} color="#facc15" />,
    title: "Express Effortlessly",
    description:
      "Visual LED indicators display your mood with beautiful, customizable patterns.",
  },
  {
    icon: <Brain size={32} color="#60a5fa" />,
    title: "AI-Driven Insights",
    description:
      "Get personal recommendations to improve your emotional wellbeing.",
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={styles.heroTitle}
        >
          AuraLink
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className={styles.heroSubtitle}
        >
          AI-powered wearable bracelet that detects and displays your emotions
          in real time.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className={styles.heroButton}
        >
          Pre-Order Now
        </motion.button>

        <div className={styles.heroGlow}></div>
      </section>

      {/* Live Mood Visualizer */}
      <section className={styles.moodSection}>
        <h2 className={styles.moodTitle}>Your Emotions, Visualized</h2>

        <div className={styles.moodImages}>
          {image && <img src={image} alt="Product 1" />}
          {image2 && <img src={image2} alt="Product 2" />}
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Why Choose AuraLink?</h2>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={styles.featureCard}
            >
              <div>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Be Among the First</h2>
        <p className={styles.ctaSubtitle}>
          Pre-order AuraLink today and experience the future of emotional
          connection.
        </p>
        <button className={styles.ctaButton}>Pre-Order Now</button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} AuraLink. All rights reserved.
      </footer>
    </div>
  );
}
