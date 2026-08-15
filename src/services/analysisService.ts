const BASE = 'http://localhost:5000/api/analysis';

export interface FrameResult {
  _id?: string;
  vegetation_indices?: {
    leaf_coverage_pct?: number;
    exg_mean?: number;
    vari_mean?: number;
    cive_mean?: number;
  };
  detections?: {
    fruits?: { count_est?: number; ripe_est?: number; unripe_est?: number };
    leaf_stains?: { area_pct?: number; clusters?: number };
  };
  fruit_summary?: { total?: number; ripe?: number; unripe?: number; malformed?: number };
  quality?: { sharpness_laplacian?: number; brightness_mean?: number; is_usable?: boolean; warnings?: string[] };
  last_explanation_text?: string;
}

export interface MappedAnalysis {
  foliarCoverage: number;
  maturity: number;
  spotSeverity: number;
  generalHealth: number;
  llmSummary?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function mapResultToAnalysis(result: FrameResult): MappedAnalysis {
  const vi = result.vegetation_indices ?? {};
  const summary = result.fruit_summary ?? {};
  const fruits = result.detections?.fruits ?? {};
  const stains = result.detections?.leaf_stains ?? {};

  const foliarCoverage = Math.round(vi.leaf_coverage_pct ?? 0);
  const total = summary.total || fruits.count_est || 0;
  const ripe = summary.ripe || fruits.ripe_est || 0;
  const maturity = total > 0 ? Math.round((ripe / total) * 100) : 0;
  const spotSeverity = Math.min(100, Math.round(stains.area_pct ?? 0));
  const generalHealth = Math.round(
    foliarCoverage * 0.4 + maturity * 0.3 + (100 - spotSeverity) * 0.3
  );

  return {
    foliarCoverage,
    maturity,
    spotSeverity,
    generalHealth,
    llmSummary: result.last_explanation_text,
    status: 'completed',
  };
}

export async function processImage(
  mission: string,
  imagePath: string,
  force = false
): Promise<{ status: string; record_id?: string }> {
  const res = await fetch(`${BASE}/process-one`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mission, image_path: imagePath, force }),
  });
  if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
  return res.json();
}

export async function getFrameResult(
  mission: string,
  stem: string
): Promise<FrameResult | null> {
  const res = await fetch(
    `${BASE}/result?mission=${encodeURIComponent(mission)}&stem=${encodeURIComponent(stem)}`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function explainFrame(
  frameId: string
): Promise<{ success: boolean; explanation: string; saved: boolean }> {
  const res = await fetch(`${BASE}/explain-frame?id=${encodeURIComponent(frameId)}`);
  if (!res.ok) throw new Error(`Explain failed: ${res.status}`);
  return res.json();
}

export async function scanMission(
  mission: string,
  force = false
): Promise<{ queued?: number }> {
  const res = await fetch(`${BASE}/scan-mission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mission, force }),
  });
  if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
  return res.json();
}
