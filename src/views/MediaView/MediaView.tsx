import React, { useState, useMemo, useEffect } from 'react';
import {
    Navigation,
    Image as ImageIcon,
    BarChart3,
    FolderOpen,
    ChevronRight,
    ChevronLeft,
    Search,
    Video,
    Heart,
    Maximize2,
    Play,
    Activity,
    Zap,
    Brain,
    Layers,
    FileText,
    ArrowRight,
    Target,
    Leaf,
    ShieldAlert,
    X,
    Loader2,
    ScanLine,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMediaLibrary } from './hooks/useMediaLibrary';
import { useAnalysis } from './hooks/useAnalysis';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const METRIC_CONFIG = [
    { id: 'foliar', label: 'Cobertura Foliar', key: 'foliarCoverage', color: 'var(--primary)', icon: Leaf, description: 'Densidad de vegetación detectada' },
    { id: 'maturity', label: 'Madurez de Fruta', key: 'maturity', color: '#f59e0b', icon: Target, description: 'Estado de maduración promedio' },
    { id: 'severity', label: 'Severidad de Manchas', key: 'spotSeverity', color: '#ef4444', icon: ShieldAlert, description: 'Presencia de patógenos o estrés' },
    { id: 'health', label: 'Salud General', key: 'generalHealth', color: '#10b981', icon: Activity, description: 'Índice de vigor vegetativo' },
];

const EmptyViewer = ({ loading, hasItems }: { loading: boolean; hasItems: boolean }) => {
    if (loading) return (
        <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-white/40" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Cargando archivos...</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Leyendo misiones guardadas</p>
            </div>
        </div>
    );
    if (!hasItems) return (
        <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <ImageIcon size={32} className="text-white/20" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Sin Misiones</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Las fotos de vuelo aparecerán aquí</p>
            </div>
        </div>
    );
    return (
        <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                <ImageIcon size={32} className="text-white/20" />
            </div>
            <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Sin Selección</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Elige un archivo del explorador inferior</p>
            </div>
        </div>
    );
};

export const MediaView = () => {
    const { missions, mediaItems, loading, reload } = useMediaLibrary();
    const {
        analysisMap,
        analyzingId,
        analyzingLlmId,
        scanningMission,
        loadExisting,
        analyzeImage,
        analyzeWithLLM,
        analyzeMission,
    } = useAnalysis();

    const [activeTab, setActiveTab] = useState<'gallery' | 'missions'>('gallery');
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
    const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

    useEffect(() => {
        if (mediaItems.length > 0 && selectedMediaId === null) {
            setSelectedMediaId(mediaItems[0].id);
        }
    }, [mediaItems, selectedMediaId]);

    const handleTabChange = (value: string) => {
        const tab = value as 'gallery' | 'missions';
        setActiveTab(tab);
        if (tab === 'gallery') {
            setSelectedMissionId(null);
        }
    };

    const handleOpenFolder = (folderPath?: string) => {
        if (folderPath) (globalThis as any).electronAPI.media.openFolder(folderPath);
    };

    const selectedMedia = useMemo(
        () => mediaItems.find(item => item.id === selectedMediaId) || null,
        [mediaItems, selectedMediaId]
    );

    // Load existing analysis from MongoDB when the selected item changes
    useEffect(() => {
        if (selectedMedia) loadExisting(selectedMedia);
    }, [selectedMedia?.id]);

    // Analysis data for the selected item (from hook, not from static mediaItem)
    const selectedAnalysis = selectedMediaId ? analysisMap[selectedMediaId] ?? null : null;
    const isAnalyzing = selectedMediaId ? analyzingId === selectedMediaId : false;
    const isAnalyzingLlm = selectedMediaId ? analyzingLlmId === selectedMediaId : false;
    const analysisReady = selectedAnalysis?.status === 'completed';

    const filteredMedia = useMemo(() => {
        return mediaItems.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.missionName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || item.type === filterType;
            const matchesMission = !selectedMissionId || item.missionId === selectedMissionId;
            return matchesSearch && matchesType && matchesMission;
        });
    }, [mediaItems, searchQuery, filterType, selectedMissionId]);

    const [isFullscreen, setIsFullscreen] = useState(false);

    const currentIndex = useMemo(
        () => filteredMedia.findIndex(item => item.id === selectedMediaId),
        [filteredMedia, selectedMediaId]
    );
    const goToPrev = () => {
        if (currentIndex > 0) setSelectedMediaId(filteredMedia[currentIndex - 1].id);
    };
    const goToNext = () => {
        if (currentIndex < filteredMedia.length - 1) setSelectedMediaId(filteredMedia[currentIndex + 1].id);
    };

    const nextMetric = () => setCurrentMetricIndex((prev) => (prev + 1) % METRIC_CONFIG.length);
    const prevMetric = () => setCurrentMetricIndex((prev) => (prev - 1 + METRIC_CONFIG.length) % METRIC_CONFIG.length);

    const currentMetric = METRIC_CONFIG[currentMetricIndex];
    const metricValue = (selectedAnalysis?.[currentMetric.key as keyof typeof selectedAnalysis] as number) || 0;

    const chartData = [
        { name: currentMetric.label, value: metricValue, fill: currentMetric.color },
        { name: 'Resto', value: 100 - metricValue, fill: 'rgba(0,0,0,0.05)' }
    ];

    return (
        <div className="h-full overflow-hidden p-4">
            <div className="flex h-full min-h-0 gap-4 animate-in fade-in duration-700">
                {/* IZQUIERDA + CENTRO */}
                <div className="flex min-h-0 flex-1 flex-col gap-4 min-w-0">
                    {/* VISUALIZADOR */}
                    <Card className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-border/50 bg-slate-950/90 shadow-xl backdrop-blur-md">
                        <div className="pointer-events-none absolute inset-0 opacity-20">
                            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary blur-[120px]" />
                            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-agro-green blur-[120px]" />
                        </div>

                        <CardHeader className="z-10 flex shrink-0 flex-row items-center justify-between gap-3 border-b border-white/5 bg-black/20 p-3 backdrop-blur-xl">
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={cn(
                                        'rounded-xl border border-white/10 p-2.5 shadow-inner',
                                        selectedMedia?.type === 'video'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-primary/20 text-primary'
                                    )}
                                >
                                    {selectedMedia?.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-[11px] font-black uppercase tracking-[0.18em] text-white">
                                        {selectedMedia?.name || 'Explorador de Inteligencia'}
                                    </h2>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="h-4 border-white/10 bg-white/5 py-0 text-[8px] font-mono text-white/60"
                                        >
                                            {selectedMedia?.missionName}
                                        </Badge>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                                            {selectedMedia?.date} • {selectedMedia?.time}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-destructive"
                                >
                                    <Heart size={14} className={selectedMedia?.isFavorite ? 'fill-current text-destructive' : ''} />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Abrir carpeta"
                                    onClick={() => handleOpenFolder(missions.find(m => m.id === selectedMedia?.missionId)?.folderPath)}
                                    className="h-8 w-8 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    <FolderOpen size={14} />
                                </Button>

                                <Separator orientation="vertical" className="mx-1 h-6 bg-white/10" />

                                <Button
                                    disabled={!selectedMedia || selectedMedia.type === 'video' || isAnalyzing}
                                    onClick={() => selectedMedia && analyzeImage(selectedMedia)}
                                    className="h-8 rounded-xl border-none bg-primary px-4 text-[9px] font-black uppercase tracking-widest text-white shadow-2xl shadow-primary/40 hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {isAnalyzing
                                        ? <Loader2 size={14} className="mr-2 animate-spin" />
                                        : <Brain size={14} className="mr-2" />}
                                    {isAnalyzing ? 'Analizando...' : 'Analizar'}
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden p-0 group">
                            <AnimatePresence mode="wait">
                                {selectedMedia ? (
                                    <motion.div
                                        key={selectedMedia.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex h-full w-full items-center justify-center p-3"
                                    >
                                        {selectedMedia.type === 'image' ? (
                                            <div className="relative flex h-full w-full items-center justify-center">
                                                <div className="relative flex h-full max-h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                                    <img
                                                        src={selectedMedia.url}
                                                        className="max-h-full max-w-full object-contain"
                                                        alt={selectedMedia.name}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                    <div className="absolute bottom-4 right-4 flex translate-y-2 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            onClick={() => setIsFullscreen(true)}
                                                            className="h-8 w-8 rounded-lg border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-xl hover:bg-white/20"
                                                        >
                                                            <Maximize2 size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                                <video
                                                    key={selectedMedia.url}
                                                    src={selectedMedia.url}
                                                    className="h-full w-full object-contain"
                                                    controls
                                                    preload="metadata"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <EmptyViewer loading={loading} hasItems={mediaItems.length > 0} />
                                )}
                            </AnimatePresence>

                            {selectedMedia && (
                                <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToPrev}
                                        disabled={currentIndex <= 0}
                                        className="pointer-events-auto h-10 w-10 rounded-xl border-white/10 bg-white/5 text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 hover:bg-white/10 disabled:opacity-0"
                                    >
                                        <ChevronLeft size={20} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToNext}
                                        disabled={currentIndex >= filteredMedia.length - 1}
                                        className="pointer-events-auto h-10 w-10 rounded-xl border-white/10 bg-white/5 text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 hover:bg-white/10 disabled:opacity-0"
                                    >
                                        <ChevronRight size={20} />
                                    </Button>
                                </div>
                            )}
                        </CardContent>

                        {selectedMedia && (
                            <div className="z-10 flex shrink-0 items-center justify-center gap-6 border-t border-white/5 bg-black/40 p-2 backdrop-blur-2xl">
                                <div className="flex items-center gap-2">
                                    <Navigation size={12} className="text-primary" />
                                    <span className="text-[10px] font-mono font-bold tracking-tight text-white/40">
                                        {selectedMedia.metadata.location.lat.toFixed(4)}, {selectedMedia.metadata.location.lng.toFixed(4)}
                                    </span>
                                </div>

                                <Separator orientation="vertical" className="h-4 bg-white/10" />

                                <div className="flex items-center gap-2">
                                    <Layers size={12} className="text-agro-green" />
                                    <span className="text-[10px] font-mono font-bold tracking-tight text-white/40">
                                        {selectedMedia.metadata.altitude}m
                                    </span>
                                </div>

                                <Separator orientation="vertical" className="h-4 bg-white/10" />

                                <div className="flex items-center gap-2">
                                    <Zap size={12} className="text-blue-400" />
                                    <span className="text-[10px] font-mono font-bold tracking-tight text-white/40">
                                        {selectedMedia.metadata.speed}m/s
                                    </span>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* EXPLORADOR */}
                    <Card className="flex h-56 shrink-0 flex-col overflow-hidden border-border/50 bg-white/50 shadow-sm backdrop-blur-sm">
                        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/10 bg-muted/20 px-4 py-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-3">
                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
                                    <TabsList className="h-8 rounded-lg bg-muted/50 p-1">
                                        <TabsTrigger value="gallery" className="rounded-md px-4 text-[9px] font-black uppercase tracking-wider">
                                            Galería
                                        </TabsTrigger>
                                        <TabsTrigger value="missions" className="rounded-md px-4 text-[9px] font-black uppercase tracking-wider">
                                            Misiones
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="flex flex-wrap items-center gap-2">
                                    {['all', 'image', 'video'].map((type) => (
                                        <Button
                                            key={type}
                                            variant={filterType === type ? 'secondary' : 'ghost'}
                                            size="sm"
                                            className="h-6 rounded-md px-2 text-[8px] font-black uppercase tracking-widest"
                                            onClick={() => setFilterType(type as 'all' | 'image' | 'video')}
                                        >
                                            {type === 'all' ? 'Todos' : type === 'image' ? 'Fotos' : 'Videos'}
                                        </Button>
                                    ))}
                                </div>

                                {selectedMissionId && (
                                    <Badge
                                        variant="secondary"
                                        className="h-6 gap-1.5 rounded-md border-primary/20 bg-primary/10 py-0 pl-2 pr-1 text-primary"
                                    >
                                        <span className="text-[8px] font-black uppercase tracking-widest">
                                            Misión: {missions.find(m => m.id === selectedMissionId)?.missionName}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 rounded-sm hover:bg-primary/20"
                                            onClick={() => setSelectedMissionId(null)}
                                        >
                                            <X size={10} />
                                        </Button>
                                    </Badge>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                                <div className="relative w-40 xl:w-48">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
                                    <Input
                                        placeholder="Buscar..."
                                        className="h-7 rounded-lg border-none bg-white/50 pl-7 text-[10px] shadow-inner"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Badge variant="outline" className="h-7 bg-white/50 px-3 text-[9px] font-mono">
                                    {filteredMedia.length} ítems
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full w-full">
                                <div className="flex gap-3 p-3">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'gallery' || selectedMissionId ? (
                                            <motion.div
                                                key="gallery-strip"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                {filteredMedia.map((item) => (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{ y: -2 }}
                                                        onClick={() => setSelectedMediaId(item.id)}
                                                        className={cn(
                                                            'relative w-44 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer',
                                                            selectedMediaId === item.id
                                                                ? 'z-10 scale-[1.02] border-primary shadow-lg'
                                                                : 'border-transparent hover:border-primary/30'
                                                        )}
                                                    >
                                                        <div className="relative aspect-video bg-muted">
                                                            {item.type === 'video' ? (
                                                                <div className="relative h-full w-full bg-slate-900">
                                                                    <video
                                                                        src={item.url}
                                                                        className="h-full w-full object-cover"
                                                                        muted
                                                                        playsInline
                                                                        preload="metadata"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                                                            <Play size={14} className="fill-current text-white" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={item.thumbnail}
                                                                    className="h-full w-full object-cover"
                                                                    alt=""
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                            )}
                                                            <div className="absolute bottom-1 right-1">
                                                                {item.isFavorite && <Heart size={10} className="fill-current text-destructive" />}
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/90 p-1.5 backdrop-blur-sm">
                                                            <p className="truncate text-[9px] font-bold text-slate-800">{item.name}</p>
                                                            <p className="truncate text-[7px] font-black uppercase tracking-tighter text-muted-foreground">
                                                                {item.date} • {item.time}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="mission-strip"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-3"
                                            >
                                                {missions.map((mission) => (
                                                    <Card
                                                        key={mission.id}
                                                        onClick={() => setSelectedMissionId(mission.id)}
                                                        className="w-52 flex-shrink-0 cursor-pointer overflow-hidden border-border/50 bg-white/40 shadow-sm transition-all hover:border-primary/30"
                                                    >
                                                        <div className="relative aspect-[21/9] overflow-hidden">
                                                            <img
                                                                src={mission.thumbnail}
                                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                                alt=""
                                                                referrerPolicy="no-referrer"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                            <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between">
                                                                <Badge className="border-none bg-white/20 text-[7px] text-white backdrop-blur-md">
                                                                    {mission.date}
                                                                </Badge>
                                                                <Badge className="border-none bg-primary/80 text-[7px] text-white">
                                                                    {mission.imagesCaptured} <ImageIcon size={6} className="ml-0.5" />
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="p-2">
                                                            <p className="truncate text-[9px] font-black uppercase tracking-tight text-slate-800">
                                                                {mission.missionName}
                                                            </p>
                                                            <div className="mt-1 flex items-center justify-between">
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">
                                                                    {mission.duration}
                                                                </span>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    disabled={scanningMission === mission.id}
                                                                    onClick={(e) => { e.stopPropagation(); analyzeMission(mission.id); }}
                                                                    className="h-5 w-5 rounded-md hover:bg-primary/10 hover:text-primary"
                                                                    title="Analizar toda la misión"
                                                                >
                                                                    {scanningMission === mission.id
                                                                        ? <Loader2 size={9} className="animate-spin" />
                                                                        : <ScanLine size={9} />}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* PANEL DERECHO */}
                <aside className="w-[280px] xl:w-[300px] min-h-0 shrink-0">
                    <Card className="h-full min-h-0 overflow-hidden border-border/50 bg-white/50 shadow-sm backdrop-blur-sm">
                        <ScrollArea className="h-full">
                            <div className="space-y-4 p-4">
                                <Card className="overflow-hidden border-border/50 bg-white/50 shadow-sm">
                                    <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                                        <div className="rounded-xl bg-primary/10 p-2 text-primary shadow-sm">
                                            <Activity size={16} />
                                        </div>
                                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
                                            Telemetría
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl border border-white/60 bg-white/40 p-3 shadow-sm">
                                                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                    Batería
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={selectedMedia?.metadata.battery || 0} className="h-1.5 flex-1 bg-slate-200" />
                                                    <span className="text-[11px] font-mono font-black text-slate-700">
                                                        {selectedMedia?.metadata.battery || 0}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-white/60 bg-white/40 p-3 shadow-sm">
                                                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                    Señal
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={selectedMedia?.metadata.signal || 0} className="h-1.5 flex-1 bg-slate-200" />
                                                    <span className="text-[11px] font-mono font-black text-slate-700">
                                                        {selectedMedia?.metadata.signal || 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="group/carousel relative overflow-hidden border-border/50 bg-white/80 shadow-md backdrop-blur-md">
                                    <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-agro-green/10 p-2 text-agro-green shadow-sm">
                                                <BarChart3 size={16} />
                                            </div>
                                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
                                                Análisis Agrícola
                                            </CardTitle>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button onClick={prevMetric} variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted">
                                                <ChevronLeft size={14} />
                                            </Button>
                                            <Button onClick={nextMetric} variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted">
                                                <ChevronRight size={14} />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-2">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentMetric.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col items-center"
                                            >
                                                <div className="relative h-40 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={chartData}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={50}
                                                                outerRadius={68}
                                                                paddingAngle={5}
                                                                dataKey="value"
                                                                startAngle={90}
                                                                endAngle={450}
                                                            >
                                                                {chartData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>

                                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                        <currentMetric.icon size={22} style={{ color: currentMetric.color }} className="mb-1 opacity-80" />
                                                        <span className="tabular-nums text-3xl font-black text-slate-800">{metricValue}%</span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 space-y-1 text-center">
                                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-800">
                                                        {currentMetric.label}
                                                    </h4>
                                                    <p className="px-3 text-[10px] font-medium text-muted-foreground">
                                                        {currentMetric.description}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex gap-1.5">
                                                    {METRIC_CONFIG.map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                'h-1.5 rounded-full transition-all duration-300',
                                                                currentMetricIndex === i ? 'w-4 bg-primary' : 'w-1.5 bg-slate-200'
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-primary/20 bg-primary/5 shadow-lg">
                                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                                    <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                                        <div className="rounded-xl bg-primary p-2 text-white shadow-lg shadow-primary/30">
                                            <Brain size={16} />
                                        </div>
                                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                            Insight Panel IA
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4 pt-2">
                                        <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm">
                                            <div className="absolute left-0 top-0 h-full w-1 bg-primary/40" />
                                            {isAnalyzingLlm ? (
                                                <div className="flex items-center gap-2 py-1">
                                                    <Loader2 size={12} className="animate-spin text-primary" />
                                                    <p className="text-[10px] font-bold text-primary">Generando análisis con IA...</p>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] italic leading-relaxed font-medium text-slate-700">
                                                    "{selectedAnalysis?.llmSummary || 'Inicia el análisis para obtener una interpretación avanzada.'}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,168,132,0.5)]" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                                    IA Activa
                                                </span>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={!analysisReady || isAnalyzingLlm}
                                                onClick={() => selectedMedia && analyzeWithLLM(selectedMedia)}
                                                className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 disabled:opacity-40"
                                            >
                                                {isAnalyzingLlm ? <Loader2 size={12} className="mr-1 animate-spin" /> : <ArrowRight size={12} className="ml-1" />}
                                                {isAnalyzingLlm ? 'Procesando...' : 'RE-ANALIZAR'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="overflow-hidden border-border/50 bg-white/50 shadow-sm">
                                    <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                                        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500 shadow-sm">
                                            <FileText size={16} />
                                        </div>
                                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
                                            Resumen Misión
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 p-4 pt-2">
                                        <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-3">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                                Imágenes
                                            </span>
                                            <span className="text-[11px] font-black text-slate-800">
                                                {missions.find(m => m.id === selectedMedia?.missionId)?.imagesCaptured || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-3">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                                Salud Promedio
                                            </span>
                                            <span className="text-[11px] font-black text-agro-green">
                                                {missions.find(m => m.id === selectedMedia?.missionId)?.healthScore || 0}%
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </Card>
                </aside>
            </div>

            <AnimatePresence>
                {isFullscreen && selectedMedia?.type === 'image' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-4 top-4 h-10 w-10 rounded-xl text-white hover:bg-white/10"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X size={20} />
                        </Button>
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={selectedMedia.url}
                            alt={selectedMedia.name}
                            referrerPolicy="no-referrer"
                            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}