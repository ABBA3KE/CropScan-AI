import './globals.css';
import { AuthProvider } from '../lib/AuthContext';
import MobileContainer from '../components/MobileContainer';

export const viewport = {
  themeColor: '#15803d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata = {
  title: 'CropScan AI - AI Crop Disease Detection',
  description: 'AI-Powered Crop Pathology & Disease Detection for Smallholder Farmers across Nigeria and West Africa',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#15803d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CropScan AI" />
      </head>
      <body>
        <AuthProvider>
          <MobileContainer>
            {children}
          </MobileContainer>
        </AuthProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('[PWA] ServiceWorker registration successful:', reg.scope);
                    },
                    function(err) {
                      console.log('[PWA] ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
