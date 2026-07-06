'use client';

import React, { useState, useEffect } from 'react';
import { Video, Search, Play, Clock, FileText, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { fetchResearchResources } from '../../lib/api';
import { ResourceItem, YouTubeVideo, TranscriptItem } from '../../lib/types';

export const TranscriptPlayer: React.FC = () => {
  const [topic, setTopic] = useState('Gradient Descent');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeTimestamp, setActiveTimestamp] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleResearch = async () => {
    setLoading(true);
    try {
      const data = await fetchResearchResources(topic);
      setResources(data.resources || []);
      if (data.resources.length > 0 && data.resources[0].youtube_videos.length > 0) {
        setSelectedVideo(data.resources[0].youtube_videos[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleResearch();
  }, []);

  const firstResource = resources[0];
  const transcripts = firstResource?.transcript || [];

  const filteredTranscripts = transcripts.filter(t =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="liquid-glass p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-brandCyan" /> YouTube Video & Interactive Navigable Transcripts
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Search educational lectures, view embedded video, and click any timestamp to jump directly in the transcript.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search topic (e.g. Linear Algebra, PyTorch)..."
            className="liquid-glass-input rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium w-full md:w-64"
          />
          <button
            onClick={handleResearch}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 hover:opacity-95 transition-all whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Find Videos
          </button>
        </div>
      </div>

      {/* Main Video & Transcript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Player & Video List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="liquid-glass p-4 rounded-3xl">
            <div className="aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-300 shadow-md">
              {selectedVideo ? (
                <iframe
                  key={`${selectedVideo.video_id}-${activeTimestamp}`}
                  src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1&start=${Math.floor(activeTimestamp)}`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <Play className="w-12 h-12 mb-2 text-brandBlue animate-pulse" />
                  <p className="text-sm font-medium">Select a video to play</p>
                </div>
              )}
            </div>

            {selectedVideo && (
              <div className="mt-4 px-2">
                <h3 className="text-base font-bold text-slate-900">{selectedVideo.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Channel: <strong className="text-slate-700">{selectedVideo.channel}</strong></span>
                  <span className="flex items-center gap-1 font-semibold"><Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Available Videos List */}
          <div className="liquid-glass p-5 rounded-3xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recommended Videos</h4>
            <div className="space-y-2">
              {firstResource?.youtube_videos.map((vid) => (
                <button
                  key={vid.video_id}
                  onClick={() => { setSelectedVideo(vid); setActiveTimestamp(0); }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedVideo?.video_id === vid.video_id
                      ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm'
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold line-clamp-1">{vid.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{vid.channel}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200">{vid.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Navigable Interactive Transcript */}
        <div className="lg:col-span-5 liquid-glass p-6 rounded-3xl flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Navigable Transcript
            </h3>
            <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
              CLICK TIMESTAMP TO JUMP
            </span>
          </div>

          {/* Search Transcript */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words in transcript..."
              className="w-full liquid-glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Transcript Scroll Area */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredTranscripts.map((t, idx) => {
              const isCurrent = Math.abs(activeTimestamp - t.timestamp_seconds) < 15;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTimestamp(t.timestamp_seconds)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-purple-50 border-purple-400 text-slate-900 shadow-sm'
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                      ⏱ {t.time_formatted}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1">
                      Jump <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-800 font-medium">{t.text}</p>
                </div>
              );
            })}

            {filteredTranscripts.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No transcript entries match your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
