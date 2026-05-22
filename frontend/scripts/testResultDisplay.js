// Quick test script for Result display logic
function normalizeRipeness(r) {
  if (!r || typeof r !== 'string') return 'undetected';
  const s = r.trim().toLowerCase();
  if (s === 'ripe') return 'ripe';
  if (s === 'unripe' || s === 'under_ripe') return 'under_ripe';
  if (s === 'overripe' || s === 'over_ripe') return 'over_ripe';
  return 'undetected';
}

const RipenessLabels = {
  ripe: 'Perfectly Ripe',
  under_ripe: 'Under-ripe',
  over_ripe: 'Over-ripe',
  undetected: 'Undetected',
};

const RipenessColors = {
  ripe: '#6DBE45',
  under_ripe: '#FF8B8B',
  over_ripe: '#FFCC00',
  undetected: '#C0C0C0',
};

function displayFor(result) {
  const { ripeness, confidence } = result;
  const resolved = normalizeRipeness(ripeness);
  const displayLabel = resolved === 'ripe' && confidence >= 0.95 ? 'Perfectly Ripe' : RipenessLabels[resolved];
  const badgeColor = RipenessColors[resolved] || RipenessColors.undetected;
  return { input: result, resolved, displayLabel, badgeColor, confidencePct: Math.round(confidence * 100) };
}

const samples = [
  { ripeness: 'ripe', confidence: 0.98 },
  { ripeness: 'ripe', confidence: 0.86 },
  { ripeness: 'unripe', confidence: 0.9 },
  { ripeness: 'overripe', confidence: 0.92 },
  { ripeness: 'unknown', confidence: 0.4 },
  { ripeness: 'under_ripe', confidence: 0.7 },
];

console.log('ResultScreen display logic test:');
for (const s of samples) {
  console.log('---');
  console.log('Input:', s);
  console.log('Output:', displayFor(s));
}
