import { useState, useCallback } from 'react';
import { MediaItem } from '../types';
import {
  processImage,
  getFrameResult,
  explainFrame,
  scanMission,
  mapResultToAnalysis,
  MappedAnalysis,
} from '@/services/analysisService';

export type AnalysisMap = Record<string, MappedAnalysis>;

const EMPTY_ANALYSIS: MappedAnalysis = {
  foliarCoverage: 0,
  maturity: 0,
  spotSeverity: 0,
  generalHealth: 0,
  status: 'pending',
};

function getFilePath(url: string): string {
  return decodeURIComponent(url.split('?path=')[1] ?? '');
}

function getStem(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

export function useAnalysis() {
  const [analysisMap, setAnalysisMap] = useState<AnalysisMap>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analyzingLlmId, setAnalyzingLlmId] = useState<string | null>(null);
  const [scanningMission, setScanningMission] = useState<string | null>(null);

  const setEntry = (id: string, entry: Partial<MappedAnalysis>) =>
    setAnalysisMap((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_ANALYSIS), ...entry },
    }));

  /** Load existing result from MongoDB if not already in map */
  const loadExisting = useCallback(
    async (item: MediaItem) => {
      if (analysisMap[item.id]) return;
      // Mark as pending immediately so we don't re-query on every image switch
      setEntry(item.id, { status: 'pending' });
      const result = await getFrameResult(item.missionId, getStem(item.name));
      if (result) setEntry(item.id, mapResultToAnalysis(result));
    },
    [analysisMap]
  );

  /** Run image analysis pipeline (sync) */
  const analyzeImage = useCallback(
    async (item: MediaItem) => {
      if (analyzingId) return;
      setAnalyzingId(item.id);
      setEntry(item.id, { status: 'processing' });
      try {
        await processImage(item.missionId, getFilePath(item.url), true);
        const result = await getFrameResult(item.missionId, getStem(item.name));
        if (result) setEntry(item.id, mapResultToAnalysis(result));
        else setEntry(item.id, { status: 'error' });
      } catch (e) {
        console.error('[Analysis] processImage error:', e);
        setEntry(item.id, { status: 'error' });
      } finally {
        setAnalyzingId(null);
      }
    },
    [analyzingId]
  );

  /** Call LLM explanation for an already-analyzed frame */
  const analyzeWithLLM = useCallback(
    async (item: MediaItem) => {
      if (analyzingLlmId) return;
      setAnalyzingLlmId(item.id);
      const frameId = `${item.missionId}__${getStem(item.name)}`;
      try {
        const result = await explainFrame(frameId);
        if (result.success) setEntry(item.id, { llmSummary: result.explanation });
      } catch (e) {
        console.error('[Analysis] explainFrame error:', e);
      } finally {
        setAnalyzingLlmId(null);
      }
    },
    [analyzingLlmId]
  );

  /** Enqueue all images in a mission for async processing */
  const analyzeMission = useCallback(
    async (missionId: string) => {
      if (scanningMission) return;
      setScanningMission(missionId);
      try {
        await scanMission(missionId);
      } catch (e) {
        console.error('[Analysis] scanMission error:', e);
      } finally {
        setScanningMission(null);
      }
    },
    [scanningMission]
  );

  return {
    analysisMap,
    analyzingId,
    analyzingLlmId,
    scanningMission,
    loadExisting,
    analyzeImage,
    analyzeWithLLM,
    analyzeMission,
  };
}
