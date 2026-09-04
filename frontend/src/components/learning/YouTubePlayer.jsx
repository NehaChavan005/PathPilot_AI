import React from 'react';
import { extractYouTubeId, makeEmbedUrl } from '../../utils/ytResources';

const YouTubePlayer = ({ url, title, onClose }) => {
  const videoId = extractYouTubeId(url);

  useEffectLockBody();

  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800">
          <h3 className="text-sm font-black text-white truncate pr-4">{title || 'Learning Video'}</h3>
          <button onClick={onClose} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">
            ✕
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`${makeEmbedUrl(videoId)}?autoplay=1&rel=0`}
            title={title || 'YouTube Player'}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

function useEffectLockBody() {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);
}

export default YouTubePlayer;
