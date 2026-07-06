"use client";

import dynamic from "next/dynamic";

const AnimatedCursor = dynamic(() => import("react-animated-cursor"), {
  ssr: false,
});

export function CustomCursor() {
  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={28}
      color="255, 87, 34" // Ultimate Orange (RGB: 255, 87, 34)
      outerAlpha={0.2}
      innerScale={0.8}
      outerScale={1.6}
      outerStyle={{
        border: "1.5px solid rgba(255, 87, 34, 0.3)",
      }}
      clickables={[
        "a",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        "label[for]",
        "select",
        "textarea",
        "button",
        ".link",
        "[role='button']",
        "summary",
        ".cursor-pointer"
      ]}
    />
  );
}
