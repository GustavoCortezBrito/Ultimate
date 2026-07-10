import Script from "next/script";

export default function GoogleTags() {
  // Google Ads Conversion ID
  const googleAdsId = "AW-16808494138";
  
  // Google Analytics ID
  const googleAnalyticsId = "G-31X50BQS14";

  return (
    <>
      {/* Google tag (gtag.js) - Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}');
          ${googleAnalyticsId ? `gtag('config', '${googleAnalyticsId}');` : ''}
        `}
      </Script>
    </>
  );
}
