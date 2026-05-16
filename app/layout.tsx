import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Alhurra Logistics | Misrata Free Zone",
  description: "Premier shipping, unloading, and storage services in Misrata Free Zone, Libya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.onerror = function(message, source, lineno, colno, error) {
              var div = document.createElement('div');
              div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:999999;padding:20px;font-family:sans-serif;font-size:12px;overflow:auto;max-height:100vh;word-wrap:break-word;';
              div.innerHTML = '<b>JS ERROR:</b> ' + message + '<br/>Source: ' + source + '<br/>Line: ' + lineno + '<br/>Error: ' + (error ? error.stack : '');
              document.body.appendChild(div);
            };
            window.onunhandledrejection = function(event) {
              var div = document.createElement('div');
              div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:darkred;color:white;z-index:999999;padding:20px;font-family:sans-serif;font-size:12px;overflow:auto;max-height:50vh;word-wrap:break-word;';
              div.innerHTML = '<b>UNHANDLED PROMISE:</b> ' + event.reason;
              document.body.appendChild(div);
            };
          `
        }} />
        {children}
      </body>
    </html>
  );
}
