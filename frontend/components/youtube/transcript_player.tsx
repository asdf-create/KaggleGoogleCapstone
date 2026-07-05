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
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-brandCyan" /> YouTube Video & Interactive Navigable Transcripts
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Search educational lectures, view embedded video, and click any timestamp to jump directly in the transcript.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search topic (e.g. Linear Algebra, PyTorch)..."
            className="bg-background border border-surfaceBorder rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brandBlue w-full md:w-64"
          />
          <button
            onClick={handleResearch}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-brandBlue to-brandCyan text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-brandBlue/20 whitespace-nowrap"
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
          <div className="glass-panel p-4 rounded-2xl border border-surfaceBorder">
            <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative border border-surfaceBorder">
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
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Play className="w-12 h-12 mb-2 text-brandBlue animate-pulse" />
                  <p className="text-sm font-medium">Select a video to play</p>
                </div>
              )}
            </div>

            {selectedVideo && (
              <div className="mt-4 px-2">
                <h3 className="text-base font-bold text-white">{selectedVideo.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>Channel: <strong className="text-gray-300">{selectedVideo.channel}</strong></span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Available Videos List */}
          <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recommended Videos</h4>
            <div className="space-y-2">
              {firstResource?.youtube_videos.map((vid) => (
                <button
                  key={vid.video_id}
                  onClick={() => { setSelectedVideo(vid); setActiveTimestamp(0); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedVideo?.video_id === vid.video_id
                      ? 'bg-brandBlue/15 border-brandBlue text-white'
                      : 'bg-surface/50 border-surfaceBorder text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold line-clamp-1">{vid.title}</p>
                      <p className="text-[10px] text-gray-400">{vid.channel}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">{vid.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Navigable Interactive Transcript */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-surfaceBorder flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brandPurple" /> Navigable Transcript
            </h3>
            <span className="text-[10px] font-mono bg-brandPurple/20 text-brandPurple px-2 py-0.5 rounded border border-brandPurple/30">
              CLICK TIMESTAMP TO JUMP
            </span>
          </div>

          {/* Search Transcript */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words in transcript..."
              className="w-full bg-background border border-surfaceBorder rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-brandPurple"
            />
          </div>

          {/* Transcript Scroll Area */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTranscripts.map((t, idx) => {
              const isCurrent = Math.abs(activeTimestamp - t.timestamp_seconds) < 15;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTimestamp(t.timestamp_seconds)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-brandPurple/20 border-brandPurple text-white shadow-md shadow-brandPurple/20'
                      : 'bg-surface/40 border-surfaceBorder text-gray-300 hover:bg-white/5 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-brandCyan bg-brandCyan/10 px-2 py-0.5 rounded border border-brandCyan/20">
                      ⏱ {t.time_formatted}
                    </span>
                    <span className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1">
                      Jump to video <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{t.text}</p>
                </div>
              );
            })}

            {filteredTranscripts.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-8">No transcript entries match your search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
