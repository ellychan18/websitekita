import { useState, useEffect } from 'react';
import { Crown, Check, Zap, Star, ShieldCheck, Ticket, MessageCircle } from 'lucide-react';
// Import data voucher
import vipData from './userVip.json';

const pricing = [
  { title: "VIP 1 Hari", price: "5.000", dur: "1 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan"], tag: "" },
  { title: "VIP 3 Hari", price: "10.000", dur: "3 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan"], tag: "" },
  { title: "VIP 7 Hari", price: "20.000", dur: "7 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "" },
  { title: "VIP 15 Hari", price: "35.000", dur: "15 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "Hemat 20%" },
  { title: "VIP 30 Hari", price: "50.000", dur: "30 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "BEST SELLER", highlight: true },
];

export default function Vip() {
  const [userData, setUserData] = useState<any>(null);
  const [licenseInput, setLicenseInput] = useState('');
  
  const SESSION_KEY = '_app_session_v2';

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const decoded = JSON.parse(atob(saved));
        const found = vipData.vouchers.find((v: any) => v.coupon === decoded.uid);
        if (found) {
          setUserData({ 
            ...found, 
            isVip: new Date(found.expired) > new Date() 
          });
        }
      } catch (e) {
        console.error("Session Error");
      }
    }
  }, []);

  const handleRedeem = () => {
    if (!licenseInput.trim()) return alert("Masukkan kode dulu Bos!");

    const found = vipData.vouchers.find((v: any) => v.coupon.trim() === licenseInput.trim());
    
    if (found) {
      const expiryDate = new Date(found.expired);
      const today = new Date();

      if (expiryDate > today) {
        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const secureData = { 
          uid: found.coupon, 
          exp: found.expired,
          usr: found.name || "Member"
        };
        
        localStorage.setItem(SESSION_KEY, btoa(JSON.stringify(secureData)));
        setUserData({ ...found, isVip: true });
        alert(`Berlangganan ${diffDays} Hari, Telah Berhasil!`);
        setLicenseInput('');
      } else {
        alert("Waduh, kode ini sudah EXPIRED Bos!");
      }
    } else {
      alert("KODE SALAH! Cek lagi atau hubungi admin @leviiwashere");
    }
  };

  return (
    <div className="pb-32 pt-6 px-4 bg-[#050505] min-h-screen text-zinc-100 font-sans">
      
      {/* 1. DASHBOARD MEMBER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[2.5rem] p-8 mb-8 shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-yellow-600/10 blur-[80px] rounded-full" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 ${userData?.isVip ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'border-zinc-800 bg-zinc-900'}`}>
            <Crown size={32} className={userData?.isVip ? 'text-yellow-500 fill-yellow-500/20' : 'text-zinc-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black uppercase tracking-tight truncate italic">
              {userData ? userData.name : 'Guest User'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] ${userData?.isVip ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                {userData?.isVip ? 'VIP Premium' : 'Free Member'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex justify-between items-end">
          <div>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1.5 opacity-50">Subscription Period</p>
            <p className="text-sm font-black text-white uppercase tracking-tighter italic">
              {userData?.isVip ? `Ends: ${userData.expired}` : 'Please activate your VIP'}
            </p>
          </div>
          {userData?.isVip && <ShieldCheck size={24} className="text-yellow-500/50" />}
        </div>
      </div>

      {/* 2. INPUT REDEEM GACOR */}
      <div className="mb-12 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-[2.2rem] blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
        <div className="relative bg-zinc-900/50 border border-white/10 rounded-[2rem] p-2 flex items-center backdrop-blur-xl shadow-2xl">
          <div className="pl-5 text-yellow-500/50">
            <Ticket size={20} />
          </div>
          <input 
            type="text" 
            placeholder="INPUT VOUCHER CODE"
            value={licenseInput}
            onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
            className="flex-1 bg-transparent px-4 py-4 text-[13px] font-black tracking-[0.3em] text-yellow-500 outline-none placeholder:text-zinc-700 placeholder:tracking-normal placeholder:font-bold"
          />
          <button 
            onClick={handleRedeem} 
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            Redeem
          </button>
        </div>
        <p className="text-[9px] text-center mt-4 text-zinc-600 font-bold uppercase tracking-widest">
          Punya kode? Masukkan di atas untuk akses Premium
        </p>
      </div>

      {/* 3. HERO PROMO */}
      <div className="text-center mb-12">
        <div className="inline-block bg-yellow-500/10 px-4 py-1 rounded-full mb-4 border border-yellow-500/20">
            <h3 className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em]">Premium Experience</h3>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4">PILIH PAKET<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">SESUAI KEINGINAN</span></h1>
      </div>

      {/* 4. PRICING LIST */}
      <div className="space-y-5 mb-20">
        {pricing.map((p, i) => (
          <div key={i} className={`relative group overflow-hidden rounded-[2.5rem] transition-all duration-500 ${p.highlight ? 'bg-zinc-800' : 'bg-zinc-900/40 border border-white/5'}`}>
            <div className={`p-7 h-full relative ${p.highlight ? 'bg-gradient-to-br from-yellow-500/10 to-transparent' : ''}`}>
              {p.tag && (
                <div className="absolute top-0 right-12 bg-red-600 text-white text-[8px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-widest animate-pulse">
                  {p.tag}
                </div>
              )}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{p.title}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white tracking-tighter italic">Rp {p.price}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${p.highlight ? 'bg-yellow-500 text-black shadow-2xl shadow-yellow-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Check size={10} className="text-yellow-500" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <a 
                href="https://t.me/leviiwashere" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`block w-full py-5 rounded-[1.5rem] text-center text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${p.highlight ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-600/20 hover:bg-yellow-400' : 'bg-white text-black hover:bg-zinc-200'}`}
              >
                Order Via Telegram
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 5. BENEFITS */}
      <div className="grid grid-cols-1 gap-4 mb-16">
          <div className="flex gap-4 p-6 bg-zinc-900/40 rounded-[2rem] border border-white/5 items-center">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-white/5 text-yellow-500">
                <Star size={24} />
            </div>
            <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-1">Ultra HD Quality</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Visual Jernih Tanpa Batas</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-zinc-900/40 rounded-[2rem] border border-white/5 items-center">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-white/5 text-yellow-500">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="font-black text-xs uppercase tracking-widest mb-1">Safe & Secure</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Akses Legal & Terjamin</p>
            </div>
          </div>
      </div>

      <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2">Developed for MyDracin</p>
        <p className="text-[8px] font-bold text-zinc-600 uppercase">Contact Admin: @leviiwashere</p>
      </div>

    </div>
  );
            }
