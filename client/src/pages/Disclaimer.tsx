import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection
        title="Disclaimer"
        subtitle="Important information about our services and limitations"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="prose dark:prose-invert max-w-none p-8">
            <div className="flex items-center gap-2 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300 m-0">
                Please read this disclaimer carefully before using NS GAMMING services
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Last Updated: October 14, 2025</p>

            <h2 className="dark:text-white">General Disclaimer</h2>
            <p className="dark:text-gray-300">
              The information contained on NS GAMMING (nsgamming.xyz) website is for general information and entertainment purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
            </p>

            <h2 className="dark:text-white">Free Fire Tools & Services Disclaimer</h2>
            <h3 className="dark:text-white">Not Affiliated with Garena</h3>
            <p className="dark:text-gray-300">
              NS GAMMING is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with Garena, Free Fire, or any of their subsidiaries or affiliates. The official Free Fire website can be found at ff.garena.com. The names "Free Fire" and related names, marks, emblems, and images are registered trademarks of their respective owners.
            </p>

            <h3 className="dark:text-white">FF Bots Usage</h3>
            <p className="dark:text-gray-300">
              Our FF Bots (Likes Bot, Info Bot, Spam Bot, Visit Bot) are third-party tools and are not officially supported by Garena. Use of these tools is at your own risk. We are not responsible for:
            </p>
            <ul className="dark:text-gray-300">
              <li>Any account suspensions, bans, or penalties from Free Fire</li>
              <li>Loss of in-game progress, items, or diamonds</li>
              <li>Any violations of Free Fire's Terms of Service resulting from tool usage</li>
              <li>Changes to Free Fire's API or systems that may affect tool functionality</li>
            </ul>

            <h3 className="dark:text-white">Rate Limiting & Fair Usage</h3>
            <p className="dark:text-gray-300">
              Our services implement rate limiting (1 use per day per IP for free users) to ensure fair usage and prevent abuse. We reserve the right to modify these limits or discontinue services without prior notice.
            </p>

            <h2 className="dark:text-white">Content & Tutorials Disclaimer</h2>
            <h3 className="dark:text-white">Educational Purpose</h3>
            <p className="dark:text-gray-300">
              All gaming tips, tricks, tutorials, and guides provided on NS GAMMING are for educational and entertainment purposes only. Results may vary based on individual skill level, device specifications, game updates, and other factors.
            </p>

            <h3 className="dark:text-white">No Guarantee of Results</h3>
            <p className="dark:text-gray-300">
              We do not guarantee that following our tutorials, sensitivity settings, or gaming strategies will improve your gameplay or achieve specific results. Gaming performance depends on multiple factors beyond our control.
            </p>

            <h2 className="dark:text-white">Technical Tools Disclaimer</h2>
            <h3 className="dark:text-white">Name Generators & UID Tools</h3>
            <p className="dark:text-gray-300">
              Generated names, UIDs, passwords, and other outputs from our tools are provided "as is" without any warranties. We are not responsible for:
            </p>
            <ul className="dark:text-gray-300">
              <li>Availability of generated names on third-party platforms</li>
              <li>Uniqueness or originality of generated content</li>
              <li>Compatibility with specific games or services</li>
              <li>Security of generated passwords (users should verify strength independently)</li>
            </ul>

            <h3 className="dark:text-white">Image Compression & File Tools</h3>
            <p className="dark:text-gray-300">
              Our image compressor and file tools process files client-side in your browser. We do not store uploaded files. However, we recommend:
            </p>
            <ul className="dark:text-gray-300">
              <li>Keeping backups of original files</li>
              <li>Not uploading sensitive or confidential documents</li>
              <li>Verifying output quality before using compressed files</li>
            </ul>

            <h2 className="dark:text-white">External Links Disclaimer</h2>
            <p className="dark:text-gray-300">
              Through this website, you can link to other websites which are not under the control of NS GAMMING. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>

            <h2 className="dark:text-white">Advertising & Affiliate Disclaimer</h2>
            <p className="dark:text-gray-300">
              This website may contain advertisements and affiliate links. We may receive compensation when you click on or make purchases via affiliate links. This does not influence our content or recommendations.
            </p>
            <p className="dark:text-gray-300">
              Google AdSense ads displayed on this website are served by Google and subject to Google's advertising policies. We do not control the content of these ads.
            </p>

            <h2 className="dark:text-white">Blog & Article Disclaimer</h2>
            <p className="dark:text-gray-300">
              Articles, blog posts, and guides on NS GAMMING represent our opinions and experiences. Information provided should not be considered professional advice. For specific gaming, technical, or business advice, please consult qualified professionals.
            </p>

            <h2 className="dark:text-white">Data & Privacy Disclaimer</h2>
            <p className="dark:text-gray-300">
              We collect certain data to provide our services (as detailed in our Privacy Policy). However:
            </p>
            <ul className="dark:text-gray-300">
              <li>We do not sell personal data to third parties</li>
              <li>We use IP tracking only for rate limiting and analytics</li>
              <li>Third-party services (Google AdSense, Analytics) have their own privacy policies</li>
              <li>Users are responsible for the security of their accounts and passwords</li>
            </ul>

            <h2 className="dark:text-white">Service Availability</h2>
            <p className="dark:text-gray-300">
              We strive to provide uninterrupted service but do not guarantee 100% uptime. Services may be temporarily unavailable due to:
            </p>
            <ul className="dark:text-gray-300">
              <li>Maintenance and updates</li>
              <li>Server issues or hosting problems</li>
              <li>Third-party API changes or outages</li>
              <li>Force majeure events</li>
            </ul>

            <h2 className="dark:text-white">Limitation of Liability</h2>
            <p className="dark:text-gray-300">
              In no event will NS GAMMING, its owner (Nishant Sarkar), or any related parties be liable for any:
            </p>
            <ul className="dark:text-gray-300">
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruption or downtime</li>
              <li>Account bans or penalties from third-party services</li>
              <li>Damages arising from use or inability to use our services</li>
              <li>Unauthorized access to user data despite reasonable security measures</li>
            </ul>

            <h2 className="dark:text-white">Age Restriction</h2>
            <p className="dark:text-gray-300">
              Free Fire is rated 12+ by app stores. While our website provides tools for Free Fire players, we require users under 18 to obtain parental consent before using our services. Parents/guardians should review our Terms and Privacy Policy.
            </p>

            <h2 className="dark:text-white">Changes to Disclaimer</h2>
            <p className="dark:text-gray-300">
              We reserve the right to update this disclaimer at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the updated disclaimer.
            </p>

            <h2 className="dark:text-white">Contact for Clarifications</h2>
            <p className="dark:text-gray-300">
              If you have questions about this disclaimer or need clarifications, please contact:
            </p>
            <ul className="dark:text-gray-300">
              <li>Email: nishant.ns.business@gmail.com</li>
              <li>WhatsApp: +91 8900653250</li>
              <li>Telegram: @Nishantsarkar10k</li>
            </ul>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using NS GAMMING, you acknowledge that you have read and understood this disclaimer and agree to its terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
