import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Lock, 
  MonitorPlay, AlignLeft, Ticket, Zap, ShieldCheck, 
  Calendar, Crown
} from 'lucide-react';
import { useLanguage } from '../store/language';
import { Helmet } from 'react-helmet-async';
import vipData from './userVip.json';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapters, setChapters] = useState<any[]>([]);
  const [watchData, setWatchData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const SESSION_KEY = '_app_session_v2';

  const getSubStatus = () => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return false;
    try {
      const decoded = JSON.parse(atob(saved));
      return new Date(decoded.exp) > new Date();
    } catch (e) { return false; }
  };

  const [isSubscribed, setIsSubscribed] = useState(getSubStatus);
  const [showLockPopup, setShowLockPopup] = useState(!getSubStatus());
  const [licenseCode, setLicenseCode] = useState('');
  const { lang } = useLanguage();

  useEffect(() => {
    if (isSubscribed) {
        setShowLockPopup(false);
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
            const decoded = JSON.parse(atob(saved));
            setExpiryDate(decoded.exp);
        }
    }
  }, [isSubscribed]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsTransitioning(true);
      try {
        if (chapters.length === 0) {
          const res = await fetch(`/api/chapters/${id}?lang=${lang}`);
          const data = await res.json();
          if (data.success) setChapters(data.data.chapterList);
        }
        const resW = await fetch(`/api/watch/${id}/${currentChapter}?lang=${lang}&direction=1`);
        const dataW = await resW.json();
        if (dataW.success) setWatchData(dataW.data);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); setIsTransitioning(false); }
    };
    fetchData();
  }, [id, currentChapter, lang]);

  const handleRedeem = () => {
    const foundVoucher = vipData.vouchers.find(
      (v: any) => v.coupon.trim() === licenseCode.trim()
    );

    if (foundVoucher) {
      const expiry = new Date(foundVoucher.expired);
      const today = new Date();
      if (expiry > today) {
        const diffTime = Math.abs(expiry.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const secureData = { 
          uid: foundVoucher.coupon, 
          exp: foundVoucher.expired,
          usr: foundVoucher.name || "Member"
        };
        localStorage.setItem(SESSION_KEY, btoa(JSON.stringify(secureData)));
        setIsSubscribed(true);
        setShowLockPopup(false);
        alert(`Berlangganan ${diffDays} Hari, Telah Berhasil!`);
      } else { 
        alert("KODE EXPIRED!"); 
      }
    } else { 
      alert("KODE SALAH!"); 
    }
  };

  const handleChapterChange = (chapterIndex: number) => {
    // Validasi agar tidak melewati batas jumlah episode
    if (chapterIndex < 1 || chapterIndex > chapters.length) return;
    
    if (!isSubscribed) { setShowLockPopup(true); return; }
    setCurrentChapter(chapterIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FUNGSI AUTO NEXT ---
  const handleAutoNext = () => {
    if (currentChapter < chapters.length) {
      console.log("Video berakhir, pindah ke episode berikutnya...");
      handleChapterChange(currentChapter + 1);
    } else {
      alert("Boskuh, ini sudah episode terakhir!");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (!watchData) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32">
      <Helmet>
        <title>{`${watchData.bookName} Ep ${currentChapter} - MyDracin`}</title>
      </Helmet>

      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-900 rounded-full transition-all">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] line-clamp-1 italic text-white">
              Now Playing: {watchData.bookName}
            </h1>
          </div>
          <div className="w-10 flex justify-end">
            {isSubscribed && <Crown size={20} className="text-yellow-500 fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
          </div>
        </div>
      </div>

      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            
            {/* STATUS INFO */}
            <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-3xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isSubscribed ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Member Status</p>
                  <p className={`text-xs font-black uppercase tracking-tighter ${isSubscribed ? 'text-yellow-500' : 'text-red-600'}`}>
                    {isSubscribed ? 'VIP Premium Access' : 'Free Member (Locked)'}
                  </p>
                </div>
              </div>
              {isSubscribed && (
                <div className="text-right border-l border-white/10 pl-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expired Date</p>
                  <p className="text-xs font-black text-white italic">{expiryDate}</p>
                </div>
              )}
            </div>

            {/* VIDEO PLAYER AREA */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-yellow-600/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
              <div className="relative bg-zinc-900 rounded-[2.5rem] p-2 border border-white/10 overflow-hidden">
                <div className="rounded-[2rem] overflow-hidden bg-black relative aspect-[9/16] md:aspect-video shadow-2xl">
                  {!isSubscribed && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-6 border border-red-600/20">
                         <Lock size={40} className="text-red-600 animate-bounce" />
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Akses Terkunci</h2>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-8 tracking-[0.2em] leading-relaxed text-balance">
                        Gunakan Voucher VIP untuk menonton episode ini dan seterusnya.
                      </p>
                      <button onClick={() => setShowLockPopup(true)} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 transition-all">
                        Redeem Voucher
                      </button>
                    </div>
                  )}
                  {/* UPDATE: ADDED onEnded FOR AUTO NEXT */}
                  <video
                    key={watchData.videoUrl}
                    src={isSubscribed ? watchData.videoUrl : ""}
                    poster={watchData.bookCover}
                    controls={isSubscribed}
                    autoPlay={isSubscribed}
                    onEnded={handleAutoNext}
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-4">
              <button 
                onClick={() => handleChapterChange(currentChapter - 1)} 
                disabled={currentChapter <= 1} 
                className="w-16 h-16 bg-zinc-900 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-zinc-500 hover:text-white disabled:opacity-10 active:scale-90 transition-all shadow-xl"
              >
                <ChevronLeft size={32} />
              </button>

              <button 
                onClick={() => handleChapterChange(currentChapter + 1)} 
                disabled={currentChapter >= chapters.length} 
                className="flex-1 h-16 relative group overflow-hidden rounded-[1.5rem] active:scale-[0.98] transition-all disabled:opacity-20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600" />
                <div className="relative flex items-center justify-center gap-4 text-white shadow-2xl">
                  <span className="font-black text-sm uppercase tracking-[0.2em] italic">Lanjut Episode</span>
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md group-hover:translate-x-2 transition-transform">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </button>
            </div>

            {/* SYNOPSIS */}
            <div className="p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase font-black text-[10px] tracking-[0.3em]">
                  <AlignLeft size={16} className="text-red-600" /> Deskripsi Cerita
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-3 italic">{watchData.bookName}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  {watchData.introduction}
                </p>
            </div>
          </div>

          {/* PLAYLIST SECTION */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 sticky top-24">
               <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-2 text-zinc-100 uppercase font-black text-xs tracking-widest">
                    <MonitorPlay size={18} className="text-red-600" /> Playlist
                  </div>
                  <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-tighter">{chapters.length} Episodes</span>
               </div>
               <div className="grid grid-cols-4 gap-2.5 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                  {chapters.map((chapter) => {
                    const ep = chapter.chapterIndex + 1;
                    const isActive = currentChapter === ep;
                    return (
                      <button
                        key={chapter.chapterId}
                        onClick={() => handleChapterChange(ep)}
                        className={`aspect-square rounded-2xl text-[11px] font-black transition-all flex items-center justify-center relative border-2 ${
                          isActive 
                            ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' 
                            : 'bg-black text-zinc-500 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {!isSubscribed && <Lock size={10} className="absolute top-1 right-1 opacity-40 text-red-500" />}
                        {ep}
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP REDEEM */}
      {showLockPopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[200] p-6">
          <div className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-sm overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
            <div className="h-40 bg-gradient-to-br from-yellow-500 to-orange-700 flex items-center justify-center relative">
               <div className="relative bg-black/30 p-5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
                  <Ticket size={48} className="text-white" />
               </div>
            </div>
            <div className="p-10 text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 italic">VIP Activation</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Unlock all premium episodes and <br/> enjoy the best quality.
              </p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="VOUCHER CODE"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value.toUpperCase())}
                  className="w-full bg-black border-2 border-white/5 rounded-2xl py-5 text-center text-xs font-black tracking-[0.4em] text-yellow-500 outline-none focus:border-yellow-500/50 transition-all placeholder:text-zinc-800"
                />
                <button 
                  onClick={handleRedeem}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-yellow-500 transition-all active:scale-95"
                >
                  Activate Access
                </button>
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <a href="https://t.me/leviiwashere" target="_blank" className="flex items-center justify-center gap-2 text-[#0088cc] font-black text-[11px] uppercase tracking-widest hover:underline">
                  Get Code: @leviiwashere
                </a>
                <button onClick={() => navigate('/')} className="mt-6 text-zinc-600 text-[9px] font-black uppercase tracking-widest hover:text-white">Back to Home</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
