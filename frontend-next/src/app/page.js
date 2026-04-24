"use client"

import { useState, useCallback } from 'react';
import axios from 'axios';
import {
  Network, Copy, CheckCircle2, AlertTriangle,
  ChevronRight, Trees, RotateCw, Layers,
  Zap, Send, Braces, CircleDot, TriangleAlert
} from 'lucide-react';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('visual');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    const data = inputText
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiUrl}/bfhl`, { data });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reach the API. Make sure the backend is running on port 4000.');
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const copyJSON = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInputText('A->B, A->C, B->D, B->E, C->F, H->I, H->J, X->Y, Y->Z, Z->X');
    setResult(null);
    setError('');
  };

  /* ────────────────────────────────────────────
     Vertical Tree — fully responsive
  ──────────────────────────────────────────── */
  const NodeTree = ({ node, treeObj, isRoot = false }) => {
    const children = treeObj ? Object.entries(treeObj) : [];
    const hasKids = children.length > 0;

    return (
      <div className="flex flex-col items-center shrink-0">
        {/* Circle */}
        <div
          className={`
            w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
            text-xs sm:text-sm font-bold z-10 relative transition-all duration-300
            ${isRoot
              ? 'bg-cyan-500/20 border-2 border-cyan-400/60 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)]'
              : hasKids
                ? 'bg-white/5 border-2 border-white/15 text-white/80'
                : 'bg-white/2 border border-white/10 text-white/45'
            }
          `}
        >
          {node}
        </div>

        {hasKids && (
          <div className="flex flex-col items-center">
            {/* Vertical stem */}
            <div className="w-px h-4 sm:h-5 tree-v" />

            {/* Horizontal bar + children */}
            <div className="flex relative">
              {children.map(([childNode, childTree], idx, arr) => (
                <div key={childNode} className="flex flex-col items-center relative pt-4 sm:pt-5 px-1.5 sm:px-3">
                  {/* Vertical drop to child */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 sm:h-5 tree-v" />
                  {/* Horizontal connectors */}
                  {arr.length > 1 && idx === 0 && (
                    <div className="absolute top-0 left-1/2 right-0 h-px tree-h" />
                  )}
                  {arr.length > 1 && idx === arr.length - 1 && (
                    <div className="absolute top-0 left-0 right-1/2 h-px tree-h" />
                  )}
                  {arr.length > 1 && idx > 0 && idx < arr.length - 1 && (
                    <div className="absolute top-0 inset-x-0 h-px tree-h" />
                  )}
                  <NodeTree node={childNode} treeObj={childTree} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ────────────────────────────────────────────
     Metric Card
  ──────────────────────────────────────────── */
  const Metric = ({ label, value, icon: Icon, color }) => (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/35">{label}</span>
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} />
      </div>
      <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${color}`}>{value}</p>
    </div>
  );

  /* ────────────────────────────────────────────
     Tag chips for invalid / duplicates
  ──────────────────────────────────────────── */
  const Tags = ({ items, variant }) => (
    items.length > 0 ? (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {items.map((e, i) => (
          <span
            key={i}
            className={`
              px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-mono font-medium border
              ${variant === 'red'
                ? 'bg-red-500/10 text-red-400 border-red-500/15'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/15'}
            `}
          >
            {e}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-xs sm:text-sm text-white/20 italic">None found</p>
    )
  );

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <>
      {/* Animated background */}
      <div className="bg-mesh">
        <div className="blob blob-1 bg-cyan-500/20" />
        <div className="blob blob-2 bg-sky-500/15" />
        <div className="blob blob-3 bg-amber-400/10" />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

          {/* ── HEADER ── */}
          <header className="anim-in">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-cyan-300/75 tracking-[0.2em] uppercase mb-3 sm:mb-4">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Graph Intelligence Engine
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              Graph<span className="text-cyan-300">.</span>Analyzer
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/40 max-w-xl leading-relaxed">
              Parse directed edges, detect cycles, and visualize tree structures — all in real time.
            </p>
          </header>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">

            {/* ─── LEFT: Input Panel ─── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 anim-in anim-d1">
              <div className="glass rounded-2xl p-5 sm:p-6 space-y-5">
                {/* Section title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-semibold text-white/60 tracking-wide uppercase flex items-center gap-2">
                    <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300/70" />
                    Input Edges
                  </h2>
                  <button
                    onClick={loadExample}
                    type="button"
                    className="text-[10px] sm:text-xs text-white/25 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Load example <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={"A->B, A->C, B->D\nor one per line:\nA->B\nA->C"}
                    rows={6}
                    className="w-full bg-white/2.5 border border-white/6 rounded-xl p-3.5 sm:p-4 text-white/80 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/25 transition-all placeholder:text-white/12 resize-none"
                    spellCheck="false"
                  />

                  <button
                    type="submit"
                    disabled={loading || !inputText.trim()}
                    className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:bg-white/4 disabled:text-white/15 text-slate-950 font-semibold py-2.5 sm:py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98]"
                  >
                    {loading
                      ? <div className="w-5 h-5 spinner" />
                      : <><Send className="w-4 h-4" />Analyze</>
                    }
                  </button>
                </form>

                {/* Error */}
                {error && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/12 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-rose-400">Request Failed</p>
                      <p className="text-[10px] sm:text-xs text-rose-400/60 mt-1 leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata card (visible only when results exist) */}
              {result && (
                <div className="glass rounded-2xl p-4 sm:p-5 anim-in space-y-2">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-white/25 tracking-widest uppercase">Metadata</h3>
                  <div className="space-y-1.5 text-[10px] sm:text-xs text-white/45 font-mono break-all">
                    <p><span className="text-white/20">user: </span>{result.user_id}</p>
                    <p><span className="text-white/20">email: </span>{result.email_id}</p>
                    <p><span className="text-white/20">roll: </span>{result.college_roll_number}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ─── RIGHT: Results Panel ─── */}
            <div className="lg:col-span-3 space-y-5 sm:space-y-6">
              {result ? (
                <div className="space-y-5 sm:space-y-6">

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 anim-in anim-d1">
                    <Metric label="Trees" value={result.summary.total_trees} icon={Trees} color="text-cyan-300" />
                    <Metric label="Cycles" value={result.summary.total_cycles} icon={RotateCw} color="text-amber-300" />
                    <Metric label="Largest" value={result.summary.largest_tree_root || '—'} icon={Layers} color="text-cyan-300" />
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 p-1 glass rounded-xl w-fit anim-in anim-d2">
                    {[
                      { id: 'visual', label: 'Tree View', icon: Network },
                      { id: 'json', label: 'Raw JSON', icon: Braces },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all cursor-pointer
                          ${activeTab === tab.id
                            ? 'bg-cyan-400/12 text-cyan-100 shadow-sm'
                            : 'text-white/30 hover:text-white/55'
                          }`}
                      >
                        <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* ── Tree View Tab ── */}
                  {activeTab === 'visual' && (
                    <div className="space-y-4 sm:space-y-5 anim-in anim-d2">
                      {result.hierarchies.length === 0 ? (
                        <div className="glass rounded-2xl p-10 sm:p-14 flex flex-col items-center text-center">
                          <Network className="w-8 h-8 sm:w-10 sm:h-10 text-white/10 mb-3" />
                          <p className="text-white/25 text-xs sm:text-sm">No hierarchies to show</p>
                        </div>
                      ) : (
                        result.hierarchies.map((h, i) => (
                          <div key={i} className="glass rounded-2xl overflow-hidden">
                            {/* Card header */}
                            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-white/4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0
                                  ${h.has_cycle
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                                  }`}
                                >
                                  {h.root}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-white/75 truncate">
                                    {h.has_cycle ? 'Cyclic Component' : `Tree rooted at ${h.root}`}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-white/25 mt-0.5">
                                    {h.has_cycle ? 'Directed cycle detected' : `Max depth: ${h.depth}`}
                                  </p>
                                </div>
                              </div>
                              <span className={`shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase border
                                ${h.has_cycle
                                  ? 'bg-amber-500/10 text-amber-400/75 border-amber-500/15'
                                  : 'bg-cyan-500/10 text-cyan-300/75 border-cyan-500/15'
                                }`}
                              >
                                {h.has_cycle ? 'Cycle' : 'Valid'}
                              </span>
                            </div>

                            {/* Card body */}
                            <div className="p-4 sm:p-6">
                              {h.has_cycle ? (
                                <div className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4">
                                  <TriangleAlert className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500/35 shrink-0" />
                                  <div>
                                    <p className="text-xs sm:text-sm text-white/45">Cycle detected — no tree view available.</p>
                                    <p className="text-[10px] sm:text-xs text-white/20 mt-1">Smallest node chosen as reference root.</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="tree-scroll flex justify-center w-full py-2 sm:py-4">
                                  <NodeTree node={h.root} treeObj={h.tree[h.root]} isRoot={true} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      {/* Invalid + Duplicates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="glass rounded-2xl p-4 sm:p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-white/30 tracking-wider uppercase">Invalid</span>
                            <span className="text-[9px] sm:text-[10px] font-bold bg-white/5 text-white/35 px-1.5 py-0.5 rounded">{result.invalid_entries.length}</span>
                          </div>
                          <Tags items={result.invalid_entries} variant="red" />
                        </div>
                        <div className="glass rounded-2xl p-4 sm:p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-white/30 tracking-wider uppercase">Duplicates</span>
                            <span className="text-[9px] sm:text-[10px] font-bold bg-white/5 text-white/35 px-1.5 py-0.5 rounded">{result.duplicate_edges.length}</span>
                          </div>
                          <Tags items={result.duplicate_edges} variant="amber" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── JSON Tab ── */}
                  {activeTab === 'json' && (
                    <div className="glass rounded-2xl overflow-hidden anim-in anim-d2 border border-[#1e293b] bg-[#0d1117] shadow-xl">
                      {/* Editor Header / MacOS Traffic Lights */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#ff5f56]/20"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#ffbd2e]/20"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#27c93f]/20"></div>
                          </div>
                          <span className="ml-3 text-[10px] sm:text-xs font-medium text-[#8b949e] font-mono flex items-center gap-1.5">
                            <Braces className="w-3 h-3" /> response.json
                          </span>
                        </div>
                        <button
                          onClick={copyJSON}
                          className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#8b949e] hover:text-cyan-200 transition-colors bg-[#21262d] hover:bg-[#30363d] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg cursor-pointer border border-[#f0f6fc1a]"
                        >
                          {copied ? <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      
                      {/* Editor Body with Line Numbers */}
                      <div className="flex overflow-auto max-h-100 sm:max-h-125 bg-[#0d1117] relative">
                        <div className="hidden sm:flex flex-col text-right px-3 py-4 sm:py-5 bg-[#0d1117]/95 backdrop-blur-md border-r border-[#30363d] text-[#484f58] font-mono text-[10px] sm:text-[11px] select-none sticky left-0 z-10 shrink-0">
                           {Array.from({ length: JSON.stringify(result, null, 2).split('\n').length }).map((_, i) => (
                             <div key={i} className="leading-[1.6]">{i + 1}</div>
                           ))}
                        </div>
                        <pre 
                           className="flex-1 text-[10px] sm:text-[11px] leading-[1.6] font-mono text-[#c9d1d9] p-4 sm:p-5 min-w-fit m-0"
                           dangerouslySetInnerHTML={{
                             __html: (() => {
                               let json = JSON.stringify(result, undefined, 2);
                               json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                               return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                                   let cls = 'text-[#79c0ff]'; // number
                                   if (/^"/.test(match)) {
                                       if (/:$/.test(match)) {
                                           cls = 'text-[#7ee787]'; // key
                                           match = match.substring(0, match.length - 1) + '<span class="text-[#c9d1d9]">:</span>'; // color colon normally
                                       } else {
                                           cls = 'text-[#a5d6ff]'; // string
                                       }
                                   } else if (/true|false/.test(match)) {
                                       cls = 'text-[#ff7b72]'; // boolean
                                   } else if (/null/.test(match)) {
                                       cls = 'text-[#ff7b72]'; // null
                                   }
                                   return '<span class="' + cls + '">' + match + '</span>';
                               });
                             })()
                           }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              ) : (
                /* ── Empty State ── */
                <div className="h-full min-h-87.5 sm:min-h-112.5 flex flex-col items-center justify-center glass rounded-2xl anim-in anim-d2 px-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/2.5 border border-white/5 flex items-center justify-center mb-5 sm:mb-6">
                    <Network className="w-6 h-6 sm:w-7 sm:h-7 text-white/12" />
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-white/20">No analysis yet</p>
                  <p className="text-xs sm:text-sm text-white/12 max-w-xs text-center mt-2 leading-relaxed">
                    Enter directed edges and hit Analyze to visualize the graph structure.
                  </p>
                  <button
                    onClick={loadExample}
                    type="button"
                    className="mt-5 sm:mt-6 text-[10px] sm:text-xs text-cyan-300/60 hover:text-cyan-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Try an example <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="text-center text-[10px] sm:text-[11px] text-white/12 pt-5 sm:pt-6 pb-3 sm:pb-4 border-t border-white/3">
            Built with Next.js &middot; Tailwind CSS &middot; Express
          </footer>
        </div>
      </div>
    </>
  );
}
