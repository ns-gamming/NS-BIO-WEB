import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="prose dark:prose-invert max-w-none p-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Last Updated: October 14, 2025</p>

            <h2 className="dark:text-white">1. Acceptance of Terms</h2>
            <p className="dark:text-gray-300">
              By accessing and using NS GAMMING (nsgamming.xyz), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use our website or services.
            </p>

            <h2 className="dark:text-white">2. Use of Services</h2>
            <h3 className="dark:text-white">2.1 Eligibility</h3>
            <p className="dark:text-gray-300">
              You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian consent to use our website and tools.
            </p>

            <h3 className="dark:text-white">2.2 Free Fire Tools & Bots</h3>
            <p className="dark:text-gray-300">
              Our Free Fire tools (FF Likes Bot, FF Info Bot, FF Spam Bot, FF Visit Bot) are provided for entertainment and personal use only. Users are responsible for complying with Garena Free Fire's Terms of Service. We are not affiliated with Garena or Free Fire.
            </p>

            <h3 className="dark:text-white">2.3 Usage Limits</h3>
            <p className="dark:text-gray-300">
              Free users are limited to one use per day for FF Bots. VIP access is available for unlimited usage. We reserve the right to modify usage limits at any time.
            </p>

            <h2 className="dark:text-white">3. User Responsibilities</h2>
            <p className="dark:text-gray-300">You agree NOT to:</p>
            <ul className="dark:text-gray-300">
              <li>Use our services for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Upload malicious code, viruses, or any harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, copy, or reproduce our content without permission</li>
              <li>Use automated bots or scripts (except as provided by our services)</li>
              <li>Violate any applicable local, state, national, or international law</li>
            </ul>

            <h2 className="dark:text-white">4. Intellectual Property</h2>
            <p className="dark:text-gray-300">
              All content on NS GAMMING, including but not limited to text, graphics, logos, images, videos, audio clips, digital downloads, data compilations, and software, is the property of Nishant Sarkar or its content suppliers and is protected by international copyright laws.
            </p>

            <h2 className="dark:text-white">5. Gaming Tools & Generators</h2>
            <h3 className="dark:text-white">5.1 Name Generators & UID Tools</h3>
            <p className="dark:text-gray-300">
              Our name generators, UID generators, and other utility tools are provided "as is" for personal use. We do not guarantee that generated names or UIDs will be available or accepted by third-party platforms.
            </p>

            <h3 className="dark:text-white">5.2 No Warranty</h3>
            <p className="dark:text-gray-300">
              We do not warrant that our tools will always be available, uninterrupted, timely, secure, or error-free. Use of our tools is at your own risk.
            </p>

            <h2 className="dark:text-white">6. Third-Party Links</h2>
            <p className="dark:text-gray-300">
              Our website may contain links to third-party websites or services that are not owned or controlled by NS GAMMING. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2 className="dark:text-white">7. User-Generated Content</h2>
            <p className="dark:text-gray-300">
              By submitting content (comments, forum posts, feedback) to our website, you grant NS GAMMING a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and display such content.
            </p>

            <h2 className="dark:text-white">8. Disclaimer of Warranties</h2>
            <p className="dark:text-gray-300">
              THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>

            <h2 className="dark:text-white">9. Limitation of Liability</h2>
            <p className="dark:text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NS GAMMING SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h2 className="dark:text-white">10. Account Termination</h2>
            <p className="dark:text-gray-300">
              We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms and Conditions.
            </p>

            <h2 className="dark:text-white">11. Changes to Terms</h2>
            <p className="dark:text-gray-300">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Continued use of the service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="dark:text-white">12. Governing Law</h2>
            <p className="dark:text-gray-300">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="dark:text-white">13. Contact Information</h2>
            <p className="dark:text-gray-300">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <ul className="dark:text-gray-300">
              <li>Email: nishant.ns.business@gmail.com</li>
              <li>WhatsApp: +91 8900653250</li>
              <li>Telegram: @Nishantsarkar10k</li>
              <li>Website: nsgamming.xyz</li>
            </ul>

            <h2 className="dark:text-white">14. Severability</h2>
            <p className="dark:text-gray-300">
              If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using NS GAMMING, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
