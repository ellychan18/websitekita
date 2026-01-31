import { useState, useEffect } from 'react';
import { Crown, Check, Zap, ShieldCheck, Ticket } from 'lucide-react';
// IMPORT LANGSUNG DARI FILE LOKAL
import vipData from './userVip.json';

const pricing = [
  { title: "VIP 1 Hari", price: "5.000", dur: "1 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan"], tag: "" },
  { title: "VIP 3 Hari", price: "10.000", dur: "3 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan"], tag: "" },
  { title: "VIP 7 Hari", price: "20.000", dur: "7 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "" },
  { title: "VIP 15 Hari", price: "35.000", dur: "15 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "Hemat 20%" },
  { title: "VIP 30 Hari", price: "50.000", dur: "30 Hari", features: ["Buka Semua Episode", "Kualitas HD", "Tanpa Iklan", "Mobile Access"], tag: "BEST SELLER", highlight: true },
];

const SESSION_KEY = '_app_session_v2';

export default function Vip() {
  const [userData, setUserData] = useState<any>(null);
  const [licenseInput, setLicenseInput] = useState('');

  // 1. Sinkronisasi status member saat halaman dibuka
  useEffect(() => {
    const checkSession = () => {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        try {
          const decoded = JSON.parse(atob(saved));
          const isExpired = new Date(decoded.exp) < new Date();
          
          setUserData({
            name: decoded.usr,
            expired: decoded.exp,
            isVip: !isExpired
          });
        } catch (e) {
          console.error("Session Error");
        }
      }
    };
    checkSession();
  }, []);

  // 2. Fungsi Redeem Pakai JSON Lokal
  const handleRedeem = () => {
    // PROTEKSI: Jika sudah VIP, blokir fungsinya
    if (userData?.isVip) {
      alert("VIP Kamu masih aktif, Boskuh! Habisin dulu masa aktifnya baru redeem lagi ya.");
      return;
    }

    if (!licenseInput.trim()) return alert("Masukkan kode dulu Bos!");

    // Cari kode di file userVip.json yang diimport di atas
    const found = vipData.vouchers.find(
      (v: any) => v.coupon.trim().toUpperCase() === licenseInput.trim().toUpperCase()
    );

    if (found) {
      const expiryDate = new Date(found.expired);
      const today = new Date();

      if (expiryDate > today) {
        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Simpan Session
        const secureData = { 
          uid: found.coupon, 
          exp: found.expired,
          usr: found.name || "Member"
        };
        
        localStorage.setItem(SESSION_KEY, btoa(JSON.stringify(secureData)));
        
        setUserData({
          name: found.name,
          expired: found.expired,
          isVip: true
        });

        alert(`Berlangganan ${diffDays} Hari, Telah Berhasil! Gacor Bos!`);
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

      {/* 2. INPUT REDEEM */}
      <div className="mb-12 relative px-1">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-[2.2rem] blur-xl opacity-50 transition-opacity"></div>
        <div className="relative bg-zinc-900/50 border border-white/10 rounded-3xl p-1.5 flex items-center backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="pl-4 text-yellow-500/50 flex-shrink-0">
            <Ticket size={18} />
          </div>
          <input 
            type="text" 
            placeholder={userData?.isVip ? "VIP IS ACTIVE" : "KODE VOUCHER"}
            value={licenseInput}
            disabled={userData?.isVip}
            onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
            className="flex-1 min-w-0 bg-transparent px-3 py-4 text-[12px] font-black tracking-[0.2em] text-yellow-500 outline-none placeholder:text-zinc-700 placeholder:tracking-normal disabled:opacity-50"
          />
          <button 
            onClick={handleRedeem} 
            disabled={userData?.isVip}
            className={`flex-shrink-0 px-5 md:px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              userData?.isVip
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
              : 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 active:scale-95 hover:bg-yellow-400'
            }`}
          >
            {userData?.isVip ? 'VIP Active' : 'Redeem'}
          </button>
        </div>
        <p className="text-[9px] text-center mt-4 text-zinc-600 font-bold uppercase tracking-[0.3em] opacity-60">
          {userData?.isVip ? "Selamat menikmati fitur premium!" : "Masukkan kode untuk akses Premium"}
        </p>
      </div>

      {/* 3. PRICING */}
      <div className="text-center mb-12">
        <div className="inline-block bg-yellow-500/10 px-4 py-1 rounded-full mb-4 border border-yellow-500/20">
            <h3 className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em]">Premium Experience</h3>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4">PILIH PAKET<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">SESUAI KEINGINAN</span></h1>
      </div>

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
      
      <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2">Developed for MyDracin</p>
        <p className="text-[8px] font-bold text-zinc-600 uppercase">Contact Admin: @leviiwashere</p>
      </div>
    </div>
  );
}
