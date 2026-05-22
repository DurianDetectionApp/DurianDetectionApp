// Quick test script for Result display logic
function normalizeRipeness(r) {
  if (!r || typeof r !== "string") return "undetected";
  const s = r.trim().toLowerCase();
  if (s === "ripe") return "ripe";
  if (
    s === "unripe" ||
    s === "under_ripe" ||
    s === "overripe" ||
    s === "over_ripe"
  )
    return "unripe";
  return "undetected";
}

const RipenessLabels = {
  ripe: "Ripe",
  unripe: "Unripe",
  undetected: "Undetected",
};

const RipenessColors = {
  ripe: "#6DBE45",
  unripe: "#FF8B8B",
  undetected: "#C0C0C0",
};

function displayFor(result) {
  const { ripeness, confidence } = result;
  const resolved = normalizeRipeness(ripeness);
  const displayLabel =
    resolved === "ripe" && confidence >= 0.95
      ? "Ripe"
      : RipenessLabels[resolved];
  const badgeColor = RipenessColors[resolved] || RipenessColors.undetected;
  return {
    input: result,
    resolved,
    displayLabel,
    badgeColor,
    confidencePct: Math.round(confidence * 100),
  };
}

const samples = [
  { ripeness: "ripe", confidence: 0.98 },
  { ripeness: "ripe", confidence: 0.86 },
  { ripeness: "unripe", confidence: 0.9 },
  { ripeness: "overripe", confidence: 0.92 },
  { ripeness: "unknown", confidence: 0.4 },
  { ripeness: "under_ripe", confidence: 0.7 },
];

console.log("ResultScreen display logic test:");
for (const s of samples) {
  console.log("---");
  console.log("Input:", s);
  console.log("Output:", displayFor(s));
}
