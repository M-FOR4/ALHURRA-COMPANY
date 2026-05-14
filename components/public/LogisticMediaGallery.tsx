"use client";

import { useState, useRef } from "react";
import { X, ZoomIn, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface PostMedia {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  display_order: number;
}

interface KeyFact {
  label: string;
  value: string;
}

interface LogisticMediaGalleryProps {
  media: PostMedia[];
  operationType: string;
  keyFacts: KeyFact[];
}

// Individual video player with sound + fullscreen controls
function VideoPlayer({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const openFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        src={src}
        controls
        loop
        playsInline
        preload="metadata"
        className={`w-full rounded-2xl bg-black ${className || ""}`}
        aria-label="Operation video"
      />
      {/* Custom overlay controls */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={toggleMute}
          className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={openFullscreen}
          className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LogisticMediaGallery({
  media,
  operationType,
  keyFacts,
}: LogisticMediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type === "video");

  if (media.length === 0) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : null
    );
  const nextItem = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % images.length : null
    );

  return (
    <div className="space-y-8">
      {/* ─── Videos ─── */}
      {videos.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
            📹 Operation Video{videos.length > 1 ? "s" : ""}
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {videos.map((video) => (
              <VideoPlayer
                key={video.id}
                src={video.media_url}
                className="max-h-[520px] object-contain"
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Images Masonry ─── */}
      {images.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
            📸 Site Photography ({images.length})
          </h3>

          {/* Adaptive grid based on count */}
          {images.length === 1 && (
            <div
              className="relative cursor-pointer group rounded-2xl overflow-hidden"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0].media_url}
                alt="Operation"
                loading="lazy"
                className="w-full max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="relative cursor-pointer group rounded-2xl overflow-hidden aspect-square"
                  onClick={() => openLightbox(i)}
                >
                  <img src={img.media_url} alt={`Photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div
                className="relative cursor-pointer group rounded-2xl overflow-hidden row-span-2"
                style={{ aspectRatio: "3/4" }}
                onClick={() => openLightbox(0)}
              >
                <img src={images[0].media_url} alt="Photo 1" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              {[1, 2].map((i) => (
                <div
                  key={images[i].id}
                  className="relative cursor-pointer group rounded-2xl overflow-hidden aspect-square"
                  onClick={() => openLightbox(i)}
                >
                  <img src={images[i].media_url} alt={`Photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length >= 4 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative cursor-pointer group rounded-2xl overflow-hidden ${i === 0 ? "md:col-span-2 aspect-video" : "aspect-square"}`}
                  onClick={() => openLightbox(i)}
                >
                  <img src={img.media_url} alt={`Photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {/* Last image overlay with +N more */}
                  {i === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-extrabold text-3xl">+{images.length - 4}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Key Facts (inline, not sidebar) ─── */}
      <div className="bg-slate-900 rounded-3xl p-8 mt-6">
        <h3 className="text-xs font-bold text-alhurra-orange uppercase tracking-[0.2em] mb-6">
          Key Operation Facts
        </h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {keyFacts.map((fact, idx) => (
            <div key={idx} className="border-b border-white/10 pb-4">
              <dt className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                {fact.label}
              </dt>
              <dd className="text-white font-semibold text-sm">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 rounded-full p-3 backdrop-blur-sm transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevItem(); }}
              className="absolute left-5 text-white/70 hover:text-white bg-white/10 rounded-full p-4 backdrop-blur-sm transition-colors text-2xl font-bold"
            >
              ‹
            </button>
          )}

          <div
            className="max-w-6xl max-h-[90vh] w-full mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].media_url}
              alt={`Full view ${lightboxIndex + 1}`}
              className="w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <p className="text-center text-white/40 text-sm mt-4">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextItem(); }}
              className="absolute right-5 text-white/70 hover:text-white bg-white/10 rounded-full p-4 backdrop-blur-sm transition-colors text-2xl font-bold"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
