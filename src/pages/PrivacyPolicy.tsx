import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const PrivacyPolicy = () => (
  <Layout>
    <section className="py-16 md:py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Privacy Policy</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Your privacy matters to us. Please review our policy below.</motion.p>
      </div>
    </section>

    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="prose prose-lg max-w-none text-foreground [&_h2]:font-heading [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-primary [&_p]:leading-relaxed [&_p]:text-foreground/85 [&_ul]:text-foreground/85 [&_li]:leading-relaxed">

          <p><strong>Effective Date:</strong> March 14, 2026</p>

          <h2>1. Information We Collect</h2>
          <p>When you use our website, we may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and other details you voluntarily provide through contact forms, course enrollments, or book purchases.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to improve your browsing experience.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process orders for books, courses, and event registrations</li>
            <li>Respond to your inquiries and messages</li>
            <li>Send newsletters and updates (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul>
            <li>With service providers who help us operate our website</li>
            <li>When required by law or to protect our legal rights</li>
            <li>With your explicit consent</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>6. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:contact@drdinalundy.com" className="text-secondary underline">contact@drdinalundy.com</a>.</p>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
