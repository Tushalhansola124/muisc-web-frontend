



// // 'use client';
// // import { useState, useRef, useEffect } from 'react';
// // import {
// //   Home, Search, Compass, Library, ListMusic, Heart, History,
// //   Mic2, Disc, Settings, ChevronDown, Bell, Crown, Play, Pause,
// //   SkipBack, SkipForward, Shuffle, Repeat, Volume2, Maximize2,
// //   Mic, List, Plus, MoreHorizontal, Check, Star, TrendingUp,
// //   Download, Users, Radio, Podcast, Zap, Music, ArrowRight,
// //   PlayCircle, X, ChevronRight, Globe, Share2
// // } from 'lucide-react';
// // import {
// //   trendingSongs, popularArtists, featuredPlaylists,
// //   newReleases, genres, recentlyPlayed, friendActivity
// // } from './data';

// // // ─── Color Swatches for covers (deterministic by index) ──────────────────────
// // const coverColors = [
// //   ['#1a1a2e','#e63946'], ['#0d1b2a','#457b9d'], ['#1a0a2e','#9b5de5'],
// //   ['#1a2e0d','#1DB954'], ['#2e1a0d','#f4a261'], ['#2e0d1a','#e76f51'],
// //   ['#0d2e2a','#2a9d8f'], ['#2e2a0d','#e9c46a'],
// // ];

// // function CoverArt({ index, size = 'md', className = '', rounded = 'rounded-xl' }: {
// //   index: number; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; rounded?: string;
// // }) {
// //   const [bg, accent] = coverColors[index % coverColors.length];
// //   const s = { sm: 48, md: 64, lg: 120, xl: 200 }[size];
// //   const bars = 5;
// //   return (
// //     <div
// //       className={`flex-shrink-0 ${rounded} overflow-hidden ${className}`}
// //       style={{ width: s, height: s, background: bg, position: 'relative' }}
// //     >
// //       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, padding: 8 }}>
// //         {Array.from({ length: bars }).map((_, i) => (
// //           <div key={i} style={{
// //             flex: 1, borderRadius: 2,
// //             background: `linear-gradient(to top, ${accent}, ${accent}44)`,
// //             height: `${[60, 85, 50, 90, 70][i]}%`,
// //           }} />
// //         ))}
// //       </div>
// //       <div style={{
// //         position: 'absolute', inset: 0,
// //         background: `radial-gradient(circle at 30% 30%, ${accent}33, transparent 60%)`,
// //       }} />
// //     </div>
// //   );
// // }

// // function CircleArt({ index, size = 56 }: { index: number; size?: number }) {
// //   const [bg, accent] = coverColors[index % coverColors.length];
// //   return (
// //     <div style={{
// //       width: size, height: size, borderRadius: '50%', background: bg,
// //       position: 'relative', overflow: 'hidden', flexShrink: 0,
// //     }}>
// //       <div style={{
// //         position: 'absolute', inset: 0,
// //         background: `radial-gradient(circle at 35% 35%, ${accent}66, transparent 65%)`,
// //       }} />
// //       <div style={{
// //         position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
// //         display: 'flex', gap: 2, alignItems: 'flex-end',
// //       }}>
// //         {[4, 7, 5, 8, 6].map((h, i) => (
// //           <div key={i} style={{ width: 2.5, height: h, borderRadius: 1, background: accent + 'cc' }} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Sidebar ─────────────────────────────────────────────────────────────────
// // function Sidebar({ activeSection, setActiveSection }: {
// //   activeSection: string; setActiveSection: (s: string) => void;
// // }) {
// //   const mainNav = [
// //     { icon: Home, label: 'Home', id: 'home' },
// //     { icon: Search, label: 'Search', id: 'search' },
// //     { icon: Compass, label: 'Browse', id: 'browse' },
// //     { icon: Library, label: 'Library', id: 'library' },
// //   ];
// //   const libraryNav = [
// //     { icon: ListMusic, label: 'Playlists', id: 'playlists' },
// //     { icon: Heart, label: 'Liked Songs', id: 'liked' },
// //     { icon: History, label: 'Recently Played', id: 'recent' },
// //     { icon: Mic2, label: 'Artists', id: 'artists' },
// //     { icon: Disc, label: 'Albums', id: 'albums' },
// //   ];
// //   const myPlaylists = ['Morning Vibes ☀️', 'Late Night Study', 'Gym Beast Mode', 'Gujarati Folk Mix', 'Bollywood 90s'];

// //   return (
// //     <aside style={{
// //       background: '#0a0a0a',
// //       borderRight: '1px solid #1a1a1a',
// //       display: 'flex', flexDirection: 'column',
// //       height: '100%', overflow: 'hidden',
// //     }}>
// //       {/* Logo */}
// //       <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a' }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //           <div style={{
// //             width: 36, height: 36, borderRadius: 10,
// //             background: 'linear-gradient(135deg, #1DB954, #0d6e33)',
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //           }}>
// //             <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
// //               {[8, 14, 10, 16, 12].map((h, i) => (
// //                 <div key={i} style={{
// //                   width: 3, height: h, borderRadius: 2, background: 'white',
// //                 }} />
// //               ))}
// //             </div>
// //           </div>
// //           <div>
// //             <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'white' }}>
// //               Sound<span style={{ color: '#1DB954' }}>Wave</span>
// //             </div>
// //             <div style={{ fontSize: 10, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
// //         {/* Main Nav */}
// //         <div style={{ marginBottom: 8 }}>
// //           {mainNav.map(({ icon: Icon, label, id }) => (
// //             <button key={id} onClick={() => setActiveSection(id)}
// //               style={{
// //                 display: 'flex', alignItems: 'center', gap: 12,
// //                 width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none',
// //                 background: activeSection === id ? 'rgba(29,185,84,0.12)' : 'transparent',
// //                 color: activeSection === id ? '#1DB954' : '#a7a7a7',
// //                 cursor: 'pointer', fontSize: 14, fontWeight: 500,
// //                 transition: 'all 0.15s ease',
// //               }}
// //               onMouseEnter={e => { if (activeSection !== id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
// //               onMouseLeave={e => { if (activeSection !== id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
// //             >
// //               <Icon size={18} />
// //               {label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Library section */}
// //         <div style={{ margin: '16px 0 8px', padding: '0 12px' }}>
// //           <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
// //             Library
// //           </div>
// //         </div>
// //         {libraryNav.map(({ icon: Icon, label, id }) => (
// //           <button key={id} onClick={() => setActiveSection(id)}
// //             style={{
// //               display: 'flex', alignItems: 'center', gap: 12,
// //               width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
// //               background: activeSection === id ? 'rgba(29,185,84,0.12)' : 'transparent',
// //               color: activeSection === id ? '#1DB954' : '#a7a7a7',
// //               cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
// //               transition: 'all 0.15s ease',
// //             }}
// //             onMouseEnter={e => { if (activeSection !== id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
// //             onMouseLeave={e => { if (activeSection !== id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
// //           >
// //             <Icon size={16} />
// //             {label}
// //           </button>
// //         ))}

// //         {/* Playlists */}
// //         <div style={{ margin: '20px 0 8px', padding: '0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //           <div style={{ fontSize: 11, fontWeight: 600, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
// //             My Playlists
// //           </div>
// //           <button style={{ background: 'none', border: 'none', color: '#6b6b6b', cursor: 'pointer', padding: 2, borderRadius: 4 }}>
// //             <Plus size={14} />
// //           </button>
// //         </div>
// //         {myPlaylists.map((pl, i) => (
// //           <button key={i}
// //             style={{
// //               display: 'flex', alignItems: 'center', gap: 10,
// //               width: '100%', padding: '7px 12px', borderRadius: 8, border: 'none',
// //               background: 'transparent', color: '#a7a7a7', cursor: 'pointer',
// //               fontSize: 13, transition: 'all 0.15s ease', textAlign: 'left',
// //             }}
// //             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
// //             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#a7a7a7'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
// //           >
// //             <div style={{
// //               width: 6, height: 6, borderRadius: '50%',
// //               background: coverColors[i % coverColors.length][1], flexShrink: 0,
// //             }} />
// //             <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl}</span>
// //           </button>
// //         ))}
// //       </div>

// //       {/* User Profile */}
// //       <div style={{ padding: '12px', borderTop: '1px solid #1a1a1a' }}>
// //         <div style={{
// //           display: 'flex', alignItems: 'center', gap: 10,
// //           padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
// //           background: 'rgba(255,255,255,0.04)',
// //         }}>
// //           <div style={{
// //             width: 36, height: 36, borderRadius: '50%',
// //             background: 'linear-gradient(135deg, #1DB954, #457b9d)',
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             fontSize: 14, fontWeight: 700, flexShrink: 0,
// //           }}>VJ</div>
// //           <div style={{ flex: 1, minWidth: 0 }}>
// //             <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Vipul Joshi</div>
// //             <div style={{ fontSize: 11, color: '#1DB954' }}>Premium Member</div>
// //           </div>
// //           <Settings size={14} color="#6b6b6b" />
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }

// // // ─── TopBar ───────────────────────────────────────────────────────────────────
// // function TopBar() {
// //   const [searchFocused, setSearchFocused] = useState(false);
// //   const [query, setQuery] = useState('');
// //   const [showNotifs, setShowNotifs] = useState(false);
// //   const [showUser, setShowUser] = useState(false);

// //   return (
// //     <div style={{
// //       height: 'var(--topbar-height)', background: 'rgba(10,10,10,0.9)',
// //       backdropFilter: 'blur(20px)', borderBottom: '1px solid #1a1a1a',
// //       display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
// //       position: 'sticky', top: 0, zIndex: 100,
// //     }}>
// //       {/* Search */}
// //       <div style={{
// //         flex: 1, maxWidth: 480, position: 'relative',
// //         display: 'flex', alignItems: 'center',
// //       }}>
// //         <Search size={16} color={searchFocused ? '#1DB954' : '#6b6b6b'} style={{ position: 'absolute', left: 14, zIndex: 1, transition: 'color 0.2s' }} />
// //         <input
// //           value={query}
// //           onChange={e => setQuery(e.target.value)}
// //           onFocus={() => setSearchFocused(true)}
// //           onBlur={() => setSearchFocused(false)}
// //           placeholder="Search songs, artists, albums, playlists..."
// //           style={{
// //             width: '100%', padding: '10px 14px 10px 40px',
// //             background: searchFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
// //             border: `1px solid ${searchFocused ? '#1DB954' : 'transparent'}`,
// //             borderRadius: 40, color: 'white', fontSize: 13.5,
// //             outline: 'none', transition: 'all 0.2s ease',
// //           }}
// //         />
// //         {query && (
// //           <button onClick={() => setQuery('')} style={{
// //             position: 'absolute', right: 12, background: 'none', border: 'none',
// //             color: '#6b6b6b', cursor: 'pointer', padding: 2,
// //           }}>
// //             <X size={14} />
// //           </button>
// //         )}
// //       </div>

// //       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
// //         {/* Premium Btn */}
// //         <button style={{
// //           display: 'flex', alignItems: 'center', gap: 6,
// //           padding: '8px 16px', borderRadius: 40, border: 'none',
// //           background: 'linear-gradient(135deg, #1DB954, #0d6e33)',
// //           color: 'white', fontWeight: 600, fontSize: 13,
// //           cursor: 'pointer', letterSpacing: '0.02em',
// //         }}>
// //           <Crown size={14} />
// //           Upgrade Premium
// //         </button>

// //         {/* Notifications */}
// //         <div style={{ position: 'relative' }}>
// //           <button onClick={() => setShowNotifs(!showNotifs)} style={{
// //             width: 38, height: 38, borderRadius: '50%', border: 'none',
// //             background: 'rgba(255,255,255,0.07)', color: '#a7a7a7',
// //             cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             position: 'relative',
// //           }}>
// //             <Bell size={16} />
// //             <div style={{
// //               position: 'absolute', top: 8, right: 8, width: 8, height: 8,
// //               borderRadius: '50%', background: '#e63946', border: '1.5px solid #0a0a0a',
// //             }} />
// //           </button>
// //           {showNotifs && (
// //             <div style={{
// //               position: 'absolute', top: 46, right: 0, width: 280,
// //               background: '#181818', border: '1px solid #282828',
// //               borderRadius: 12, padding: 12, zIndex: 200, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
// //             }}>
// //               <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6b6b', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Notifications</div>
// //               {['New release: Sabrina Carpenter - Short n\' Sweet', 'Priya started following you', 'Your playlist was liked 23 times'].map((n, i) => (
// //                 <div key={i} style={{
// //                   padding: '8px 6px', borderRadius: 8, fontSize: 13, color: '#a7a7a7',
// //                   borderBottom: i < 2 ? '1px solid #222' : 'none',
// //                 }}>{n}</div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* User Avatar */}
// //         <div style={{ position: 'relative' }}>
// //           <button onClick={() => setShowUser(!showUser)} style={{
// //             display: 'flex', alignItems: 'center', gap: 8,
// //             padding: '4px 4px 4px 4px', borderRadius: 40,
// //             background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer',
// //           }}>
// //             <div style={{
// //               width: 30, height: 30, borderRadius: '50%',
// //               background: 'linear-gradient(135deg, #1DB954, #457b9d)',
// //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// //               fontSize: 12, fontWeight: 700, color: 'white',
// //             }}>VJ</div>
// //             <ChevronDown size={14} color="#a7a7a7" style={{ marginRight: 6 }} />
// //           </button>
// //           {showUser && (
// //             <div style={{
// //               position: 'absolute', top: 46, right: 0, width: 200,
// //               background: '#181818', border: '1px solid #282828',
// //               borderRadius: 12, padding: 8, zIndex: 200, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
// //             }}>
// //               {['Profile', 'Account', 'Settings', 'Help', 'Log out'].map((item, i) => (
// //                 <button key={i} style={{
// //                   display: 'block', width: '100%', textAlign: 'left',
// //                   padding: '9px 12px', background: 'none', border: 'none',
// //                   color: item === 'Log out' ? '#e63946' : '#a7a7a7',
// //                   borderRadius: 8, cursor: 'pointer', fontSize: 13.5,
// //                   borderTop: item === 'Log out' ? '1px solid #282828' : 'none',
// //                   marginTop: item === 'Log out' ? 4 : 0,
// //                 }}>
// //                   {item}
// //                 </button>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Hero Banner ──────────────────────────────────────────────────────────────
// // function HeroBanner({ onPlay }: { onPlay: () => void }) {
// //   const [following, setFollowing] = useState(false);

// //   return (
// //     <div style={{
// //       position: 'relative', height: 340, borderRadius: 20, overflow: 'hidden',
// //       background: 'linear-gradient(135deg, #0d1b0f 0%, #0a1a2e 50%, #1a0a1e 100%)',
// //       margin: '24px 24px 0',
// //     }}>
// //       {/* Bg orbs */}
// //       <div style={{ position: 'absolute', top: -40, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,185,84,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
// //       <div style={{ position: 'absolute', bottom: -60, right: 100, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(69,123,157,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
// //       <div style={{ position: 'absolute', top: 40, right: 200, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,93,229,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

// //       {/* Floating waveform */}
// //       <div style={{
// //         position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
// //         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
// //         opacity: 0.3,
// //       }}>
// //         {Array.from({ length: 40 }).map((_, i) => (
// //           <div key={i} style={{
// //             width: 4, borderRadius: 2,
// //             background: 'linear-gradient(to top, #1DB954, rgba(29,185,84,0.2))',
// //             height: `${Math.sin(i * 0.4) * 60 + 80}px`,
// //             animationName: 'waveform',
// //             animationDuration: '1.2s',
// //             animationTimingFunction: 'ease-in-out',
// //             animationIterationCount: 'infinite',
// //             animationDelay: `${i * 0.05}s`,
// //           }} />
// //         ))}
// //       </div>

// //       <div style={{ position: 'relative', zIndex: 1, padding: '40px 48px', height: '100%', display: 'flex', alignItems: 'center', gap: 40 }}>
// //         {/* Album cover */}
// //         <div style={{
// //           width: 200, height: 200, borderRadius: 16, flexShrink: 0,
// //           background: 'linear-gradient(135deg, #0d1b0f, #1a2e0d)',
// //           boxShadow: '0 30px 80px rgba(29,185,84,0.3), 0 0 0 1px rgba(29,185,84,0.15)',
// //           position: 'relative', overflow: 'hidden',
// //           animation: 'float 4s ease-in-out infinite',
// //         }}>
// //           <div style={{
// //             position: 'absolute', inset: 0, padding: 20,
// //             display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
// //           }}>
// //             <div style={{ display: 'flex', gap: 4, marginBottom: 16, alignItems: 'flex-end' }}>
// //               {[20, 35, 25, 45, 30, 40, 28, 50, 22, 38].map((h, i) => (
// //                 <div key={i} style={{
// //                   flex: 1, borderRadius: 2,
// //                   background: `linear-gradient(to top, #1DB954, rgba(29,185,84,0.3))`,
// //                   height: h,
// //                   animationName: 'equalizer',
// //                   animationDuration: '0.8s',
// //                   animationTimingFunction: 'ease-in-out',
// //                   animationIterationCount: 'infinite',
// //                   animationDelay: `${i * 0.08}s`,
// //                 }} />
// //               ))}
// //             </div>
// //           </div>
// //           <div style={{
// //             position: 'absolute', inset: 0,
// //             background: 'radial-gradient(circle at 30% 20%, rgba(29,185,84,0.4), transparent 60%)',
// //           }} />
// //         </div>

// //         {/* Info */}
// //         <div>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
// //             <div style={{
// //               fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
// //               color: '#1DB954', background: 'rgba(29,185,84,0.12)', padding: '3px 10px', borderRadius: 20,
// //             }}>🔥 Featured Album</div>
// //             <div style={{ fontSize: 11, color: '#6b6b6b' }}>Released Nov 2024</div>
// //           </div>
// //           <h1 style={{
// //             fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800,
// //             lineHeight: 1.0, marginBottom: 8, letterSpacing: '-0.03em',
// //             background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
// //             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
// //           }}>
// //             GNX
// //           </h1>
// //           <div style={{ fontSize: 18, color: '#a7a7a7', marginBottom: 6, fontWeight: 500 }}>
// //             Kendrick Lamar
// //           </div>
// //           <div style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 24 }}>
// //             12 tracks · Hip-Hop / Rap · 2024
// //           </div>
// //           <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
// //             <button onClick={onPlay} style={{
// //               display: 'flex', alignItems: 'center', gap: 10,
// //               padding: '12px 28px', borderRadius: 50, border: 'none',
// //               background: '#1DB954', color: 'white', fontWeight: 700,
// //               fontSize: 15, cursor: 'pointer', transition: 'all 0.2s ease',
// //             }}
// //             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1ed760'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
// //             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1DB954'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
// //             >
// //               <Play size={18} fill="white" /> Play Now
// //             </button>
// //             <button onClick={() => setFollowing(!following)} style={{
// //               padding: '11px 24px', borderRadius: 50,
// //               border: `1.5px solid ${following ? '#1DB954' : 'rgba(255,255,255,0.3)'}`,
// //               background: following ? 'rgba(29,185,84,0.15)' : 'transparent',
// //               color: following ? '#1DB954' : 'white',
// //               fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s ease',
// //               display: 'flex', alignItems: 'center', gap: 6,
// //             }}>
// //               {following ? <Check size={16} /> : <Plus size={16} />}
// //               {following ? 'Following' : 'Follow'}
// //             </button>
// //             <button style={{
// //               width: 42, height: 42, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.15)',
// //               background: 'transparent', color: '#a7a7a7', cursor: 'pointer',
// //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             }}>
// //               <MoreHorizontal size={18} />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Section Header ───────────────────────────────────────────────────────────
// // function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
// //   return (
// //     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
// //       <div>
// //         <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
// //           {title}
// //         </h2>
// //         {subtitle && <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 2 }}>{subtitle}</p>}
// //       </div>
// //       <button style={{
// //         display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
// //         color: '#a7a7a7', background: 'none', border: 'none', cursor: 'pointer',
// //         transition: 'color 0.2s',
// //       }}
// //       onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1DB954'}
// //       onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#a7a7a7'}
// //       >
// //         See all <ChevronRight size={14} />
// //       </button>
// //     </div>
// //   );
// // }

// // // ─── Trending Songs ───────────────────────────────────────────────────────────
// // function TrendingSongs({ onPlay }: { onPlay: (song: typeof trendingSongs[0]) => void }) {
// //   const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set([1, 4]));
// //   const [hoveredId, setHoveredId] = useState<number | null>(null);

// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="Trending Now" subtitle="What everyone's listening to" />
// //       <div className="horizontal-scroll" style={{ display: 'flex', gap: 16 }}>
// //         {trendingSongs.map((song, idx) => (
// //           <div key={song.id}
// //             onMouseEnter={() => setHoveredId(song.id)}
// //             onMouseLeave={() => setHoveredId(null)}
// //             style={{
// //               flexShrink: 0, width: 175,
// //               background: hoveredId === song.id ? '#1a1a1a' : '#111111',
// //               borderRadius: 16, padding: 16, cursor: 'pointer',
// //               transition: 'all 0.25s ease', border: '1px solid #1e1e1e',
// //               transform: hoveredId === song.id ? 'translateY(-4px)' : 'none',
// //               boxShadow: hoveredId === song.id ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
// //             }}
// //           >
// //             <div style={{ position: 'relative', marginBottom: 12 }}>
// //               <CoverArt index={idx} size="lg" className="" rounded="rounded-xl" />
// //               <div style={{
// //                 position: 'absolute', top: 8, left: 8,
// //                 background: 'rgba(0,0,0,0.7)', borderRadius: 20,
// //                 padding: '2px 8px', fontSize: 10, fontWeight: 700,
// //                 color: '#1DB954', backdropFilter: 'blur(10px)',
// //               }}>#{idx + 1}</div>
// //               <button
// //                 onClick={() => onPlay(song)}
// //                 style={{
// //                   position: 'absolute', bottom: 8, right: 8,
// //                   width: 36, height: 36, borderRadius: '50%',
// //                   background: '#1DB954', border: 'none', cursor: 'pointer',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                   opacity: hoveredId === song.id ? 1 : 0,
// //                   transform: hoveredId === song.id ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(4px)',
// //                   transition: 'all 0.2s ease',
// //                   boxShadow: '0 4px 12px rgba(29,185,84,0.4)',
// //                 }}
// //               >
// //                 <Play size={14} fill="white" color="white" />
// //               </button>
// //             </div>
// //             <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //               {song.title}
// //             </div>
// //             <div style={{ fontSize: 12, color: '#a7a7a7', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //               {song.artist}
// //             </div>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //               <span style={{ fontSize: 11, color: '#6b6b6b' }}>{song.plays} plays</span>
// //               <button
// //                 onClick={() => {
// //                   const s = new Set(likedSongs);
// //                   s.has(song.id) ? s.delete(song.id) : s.add(song.id);
// //                   setLikedSongs(s);
// //                 }}
// //                 style={{
// //                   background: 'none', border: 'none', cursor: 'pointer',
// //                   color: likedSongs.has(song.id) ? '#ff4d6d' : '#6b6b6b',
// //                   padding: 2, transition: 'all 0.2s ease',
// //                 }}
// //               >
// //                 <Heart size={14} fill={likedSongs.has(song.id) ? '#ff4d6d' : 'none'} />
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Popular Artists ──────────────────────────────────────────────────────────
// // function PopularArtists() {
// //   const [followed, setFollowed] = useState<Set<number>>(new Set([1]));

// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="Popular Artists" subtitle="Most streamed this week" />
// //       <div className="horizontal-scroll" style={{ display: 'flex', gap: 20 }}>
// //         {popularArtists.map((artist, idx) => (
// //           <div key={artist.id} style={{
// //             flexShrink: 0, width: 160, textAlign: 'center',
// //             padding: '20px 16px', borderRadius: 16,
// //             background: '#111111', border: '1px solid #1e1e1e',
// //             cursor: 'pointer', transition: 'all 0.25s ease',
// //           }}
// //           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; }}
// //           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.background = '#111111'; }}
// //           >
// //             <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
// //               <CircleArt index={idx} size={80} />
// //               {artist.verified && (
// //                 <div style={{
// //                   position: 'absolute', bottom: 2, right: 2,
// //                   width: 20, height: 20, borderRadius: '50%',
// //                   background: '#1DB954', border: '2px solid #111',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                 }}>
// //                   <Check size={10} color="white" strokeWidth={3} />
// //                 </div>
// //               )}
// //             </div>
// //             <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4 }}>{artist.name}</div>
// //             <div style={{ fontSize: 11, color: '#6b6b6b', marginBottom: 2 }}>{artist.genre}</div>
// //             <div style={{ fontSize: 11, color: '#a7a7a7', marginBottom: 14 }}>{artist.listeners} listeners</div>
// //             <button
// //               onClick={() => {
// //                 const s = new Set(followed);
// //                 s.has(artist.id) ? s.delete(artist.id) : s.add(artist.id);
// //                 setFollowed(s);
// //               }}
// //               style={{
// //                 padding: '6px 18px', borderRadius: 40, fontSize: 12, fontWeight: 600,
// //                 border: `1px solid ${followed.has(artist.id) ? '#1DB954' : '#404040'}`,
// //                 background: followed.has(artist.id) ? 'rgba(29,185,84,0.15)' : 'transparent',
// //                 color: followed.has(artist.id) ? '#1DB954' : '#a7a7a7',
// //                 cursor: 'pointer', transition: 'all 0.2s ease',
// //               }}
// //             >
// //               {followed.has(artist.id) ? 'Following' : 'Follow'}
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Featured Playlists ───────────────────────────────────────────────────────
// // function FeaturedPlaylists({ onPlay }: { onPlay: () => void }) {
// //   const [hoveredId, setHoveredId] = useState<number | null>(null);

// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="Featured Playlists" subtitle="Curated for every moment" />
// //       <div className="horizontal-scroll" style={{ display: 'flex', gap: 16 }}>
// //         {featuredPlaylists.map((pl, idx) => (
// //           <div key={pl.id}
// //             onMouseEnter={() => setHoveredId(pl.id)}
// //             onMouseLeave={() => setHoveredId(null)}
// //             style={{
// //               flexShrink: 0, width: 200,
// //               background: hoveredId === pl.id ? '#1a1a1a' : '#111111',
// //               borderRadius: 16, overflow: 'hidden',
// //               border: '1px solid #1e1e1e', cursor: 'pointer',
// //               transition: 'all 0.25s ease',
// //               transform: hoveredId === pl.id ? 'translateY(-4px)' : 'none',
// //               boxShadow: hoveredId === pl.id ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
// //             }}
// //           >
// //             <div style={{ position: 'relative' }}>
// //               <CoverArt index={idx + 2} size="xl" rounded="" className="" />
// //               <div style={{
// //                 position: 'absolute', inset: 0,
// //                 background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))',
// //               }} />
// //               <div style={{
// //                 position: 'absolute', top: 10, left: 10,
// //                 fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
// //                 padding: '2px 8px', borderRadius: 4,
// //                 background: 'rgba(29,185,84,0.85)', color: 'white',
// //               }}>{pl.tag}</div>
// //               <button
// //                 onClick={onPlay}
// //                 style={{
// //                   position: 'absolute', bottom: 12, right: 12,
// //                   width: 42, height: 42, borderRadius: '50%',
// //                   background: '#1DB954', border: 'none', cursor: 'pointer',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                   opacity: hoveredId === pl.id ? 1 : 0,
// //                   transform: hoveredId === pl.id ? 'scale(1)' : 'scale(0.7)',
// //                   transition: 'all 0.2s ease',
// //                   boxShadow: '0 4px 16px rgba(29,185,84,0.5)',
// //                 }}
// //               >
// //                 <Play size={16} fill="white" color="white" />
// //               </button>
// //             </div>
// //             <div style={{ padding: '14px 14px 16px' }}>
// //               <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                 {pl.title}
// //               </div>
// //               <div style={{ fontSize: 12, color: '#a7a7a7', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                 {pl.desc}
// //               </div>
// //               <div style={{ fontSize: 11, color: '#6b6b6b' }}>{pl.songs} songs</div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── New Releases ─────────────────────────────────────────────────────────────
// // function NewReleases({ onPlay }: { onPlay: () => void }) {
// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="New Releases" subtitle="Fresh drops this month" />
// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
// //         {newReleases.map((release, idx) => (
// //           <div key={release.id} style={{
// //             background: '#111111', borderRadius: 14, overflow: 'hidden',
// //             border: '1px solid #1e1e1e', cursor: 'pointer', transition: 'all 0.25s ease',
// //           }}
// //           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; }}
// //           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.background = '#111111'; }}
// //           >
// //             <div style={{ position: 'relative' }}>
// //               <CoverArt index={idx + 4} size="xl" rounded="" className="" />
// //               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.85))' }} />
// //               <div style={{
// //                 position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px',
// //                 fontSize: 10, fontWeight: 600, color: '#a7a7a7',
// //               }}>
// //                 {release.type} · {release.tracks} tracks
// //               </div>
// //             </div>
// //             <div style={{ padding: 12 }}>
// //               <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                 {release.title}
// //               </div>
// //               <div style={{ fontSize: 12, color: '#a7a7a7', marginBottom: 10 }}>{release.artist}</div>
// //               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                 <span style={{ fontSize: 11, color: '#6b6b6b' }}>{release.date}</span>
// //                 <button onClick={onPlay} style={{
// //                   width: 30, height: 30, borderRadius: '50%',
// //                   background: '#1DB954', border: 'none', cursor: 'pointer',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                 }}>
// //                   <Play size={12} fill="white" color="white" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Genres ───────────────────────────────────────────────────────────────────
// // function GenresSection() {
// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="Browse by Genre" />
// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
// //         {genres.map((g, i) => (
// //           <div key={i} style={{
// //             borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
// //             transition: 'transform 0.2s ease',
// //             background: `linear-gradient(135deg, ${g.color1}, ${g.color2})`,
// //             padding: '18px 16px', position: 'relative',
// //           }}
// //           onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
// //           onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
// //           >
// //             <div style={{ fontSize: 22, marginBottom: 6 }}>{g.emoji}</div>
// //             <div style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>{g.name}</div>
// //             <div style={{
// //               position: 'absolute', bottom: -8, right: -8, fontSize: 40, opacity: 0.15,
// //             }}>{g.emoji}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Recently Played ──────────────────────────────────────────────────────────
// // function RecentlyPlayedSection({ onPlay }: { onPlay: () => void }) {
// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <SectionHeader title="Recently Played" subtitle="Pick up where you left off" />
// //       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
// //         {recentlyPlayed.map((item, idx) => (
// //           <div key={item.id}
// //             style={{
// //               display: 'flex', alignItems: 'center', gap: 14,
// //               padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
// //               transition: 'background 0.15s ease',
// //             }}
// //             onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
// //             onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
// //           >
// //             <div style={{ width: 28, textAlign: 'center', fontSize: 13, color: '#6b6b6b', fontWeight: 500 }}>{idx + 1}</div>
// //             <CoverArt index={idx} size="sm" />
// //             <div style={{ flex: 1, minWidth: 0 }}>
// //               <div style={{ fontSize: 14, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
// //               <div style={{ fontSize: 12, color: '#a7a7a7' }}>{item.artist}</div>
// //             </div>
// //             <div style={{ fontSize: 11, color: '#6b6b6b' }}>{item.time}</div>
// //             <button onClick={onPlay} style={{
// //               width: 30, height: 30, borderRadius: '50%', background: '#1DB954',
// //               border: 'none', cursor: 'pointer',
// //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             }}>
// //               <Play size={11} fill="white" color="white" />
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Premium Banner ───────────────────────────────────────────────────────────
// // function PremiumBanner() {
// //   return (
// //     <section style={{ padding: '32px 24px 0' }}>
// //       <div style={{
// //         borderRadius: 20, padding: '28px 40px',
// //         background: 'linear-gradient(135deg, #0d2a14 0%, #0a1520 50%, #1a0a2e 100%)',
// //         border: '1px solid rgba(29,185,84,0.2)',
// //         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //         position: 'relative', overflow: 'hidden',
// //       }}>
// //         <div style={{
// //           position: 'absolute', top: -30, right: 200, width: 150, height: 150, borderRadius: '50%',
// //           background: 'radial-gradient(circle, rgba(29,185,84,0.15), transparent 70%)',
// //           pointerEvents: 'none',
// //         }} />
// //         <div>
// //           <div style={{
// //             display: 'inline-flex', alignItems: 'center', gap: 6,
// //             background: 'rgba(29,185,84,0.12)', padding: '4px 12px', borderRadius: 20,
// //             marginBottom: 12,
// //           }}>
// //             <Crown size={12} color="#1DB954" />
// //             <span style={{ fontSize: 11, fontWeight: 700, color: '#1DB954', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SoundWave Premium</span>
// //           </div>
// //           <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
// //             Unlock the full experience
// //           </h3>
// //           <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
// //             {['Ad-free music', 'Offline downloads', 'Hi-Fi audio quality', 'Unlimited skips'].map((f, i) => (
// //               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a7a7a7' }}>
// //                 <Check size={14} color="#1DB954" /> {f}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //         <div style={{ textAlign: 'right', flexShrink: 0 }}>
// //           <div style={{ fontSize: 13, color: '#6b6b6b', marginBottom: 4 }}>Starting from</div>
// //           <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
// //             ₹119<span style={{ fontSize: 14, fontWeight: 400, color: '#a7a7a7' }}>/month</span>
// //           </div>
// //           <button style={{
// //             marginTop: 12, padding: '12px 28px', borderRadius: 40,
// //             background: 'linear-gradient(135deg, #1DB954, #0d6e33)',
// //             border: 'none', color: 'white', fontWeight: 700,
// //             fontSize: 14, cursor: 'pointer',
// //           }}>
// //             Get Premium Free for 1 Month
// //           </button>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Right Sidebar ────────────────────────────────────────────────────────────
// // function RightSidebar() {
// //   return (
// //     <aside style={{
// //       width: 260, background: '#0a0a0a',
// //       borderLeft: '1px solid #1a1a1a',
// //       display: 'flex', flexDirection: 'column',
// //       overflowY: 'auto', padding: '20px 16px',
// //     }}>
// //       {/* Friend Activity */}
// //       <div style={{ marginBottom: 28 }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
// //           <Users size={14} color="#6b6b6b" />
// //           <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Friend Activity</span>
// //         </div>
// //         {friendActivity.map((f, i) => (
// //           <div key={i} style={{
// //             display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
// //             borderBottom: i < friendActivity.length - 1 ? '1px solid #1a1a1a' : 'none',
// //           }}>
// //             <div style={{
// //               width: 32, height: 32, borderRadius: '50%',
// //               background: `linear-gradient(135deg, ${coverColors[i][1]}, ${coverColors[i][0]})`,
// //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// //               fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
// //             }}>{f.name[0]}</div>
// //             <div style={{ flex: 1, minWidth: 0 }}>
// //               <div style={{ fontSize: 12, fontWeight: 600, color: '#a7a7a7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                 {f.name}
// //               </div>
// //               <div style={{ fontSize: 11, color: '#6b6b6b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                 {f.song}
// //               </div>
// //             </div>
// //             <div style={{ fontSize: 10, color: '#4a4a4a' }}>{f.time}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Trending Charts */}
// //       <div style={{ marginBottom: 28 }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
// //           <TrendingUp size={14} color="#6b6b6b" />
// //           <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Charts</span>
// //         </div>
// //         {trendingSongs.slice(0, 5).map((song, i) => (
// //           <div key={song.id} style={{
// //             display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
// //             borderBottom: i < 4 ? '1px solid #141414' : 'none',
// //           }}>
// //             <span style={{ width: 16, fontSize: 11, color: '#4a4a4a', fontWeight: 700, textAlign: 'center' }}>{i + 1}</span>
// //             <CoverArt index={i} size="sm" />
// //             <div style={{ flex: 1, minWidth: 0 }}>
// //               <div style={{ fontSize: 12, fontWeight: 600, color: '#a7a7a7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
// //               <div style={{ fontSize: 11, color: '#6b6b6b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Listening Stats */}
// //       <div>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
// //           <Zap size={14} color="#6b6b6b" />
// //           <span style={{ fontSize: 11, fontWeight: 700, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Stats</span>
// //         </div>
// //         <div style={{ background: '#111', borderRadius: 12, padding: 14, border: '1px solid #1e1e1e' }}>
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
// //             {[
// //               { label: 'Minutes', value: '1,234' },
// //               { label: 'Songs', value: '89' },
// //               { label: 'Artists', value: '34' },
// //               { label: 'Streak', value: '7 days 🔥' },
// //             ].map((stat, i) => (
// //               <div key={i} style={{ textAlign: 'center' }}>
// //                 <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#1DB954' }}>{stat.value}</div>
// //                 <div style={{ fontSize: 10, color: '#6b6b6b', marginTop: 1 }}>{stat.label}</div>
// //               </div>
// //             ))}
// //           </div>
// //           <div style={{ marginTop: 12, fontSize: 11, color: '#6b6b6b', textAlign: 'center' }}>This week's listening</div>
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }

// // // ─── Music Player ─────────────────────────────────────────────────────────────
// // function MusicPlayer({ currentSong, isPlaying, onPlayPause }: {
// //   currentSong: typeof trendingSongs[0] | null;
// //   isPlaying: boolean;
// //   onPlayPause: () => void;
// // }) {
// //   const [progress, setProgress] = useState(35);
// //   const [volume, setVolume] = useState(70);
// //   const [shuffled, setShuffled] = useState(false);
// //   const [repeated, setRepeated] = useState(false);
// //   const [liked, setLiked] = useState(false);

// //   const song = currentSong || trendingSongs[0];

// //   return (
// //     <div style={{
// //       gridColumn: '1 / -1',
// //       background: 'rgba(10,10,10,0.96)',
// //       backdropFilter: 'blur(40px)',
// //       borderTop: '1px solid #1e1e1e',
// //       display: 'flex', alignItems: 'center',
// //       padding: '0 20px', height: 'var(--player-height)',
// //       gap: 20, position: 'relative', zIndex: 200,
// //     }}>
// //       {/* Progress bar overlay */}
// //       <div style={{
// //         position: 'absolute', top: 0, left: 0, right: 0, height: 3,
// //         background: '#1e1e1e',
// //       }}>
// //         <div style={{
// //           height: '100%', width: `${progress}%`,
// //           background: 'linear-gradient(90deg, #1DB954, #1ed760)',
// //           transition: 'width 0.1s',
// //         }} />
// //       </div>

// //       {/* Song info */}
// //       <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: 260, flexShrink: 0 }}>
// //         <div style={{ position: 'relative' }}>
// //           <CoverArt index={song.id % 8} size="sm" />
// //           {isPlaying && (
// //             <div style={{
// //               position: 'absolute', inset: 0, borderRadius: 12,
// //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// //               background: 'rgba(0,0,0,0.4)', gap: 2,
// //             }}>
// //               {[1, 2, 3, 4].map(i => (
// //                 <div key={i} className="eq-bar" style={{ height: 4 }} />
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //         <div style={{ minWidth: 0 }}>
// //           <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //             {song.title}
// //           </div>
// //           <div style={{ fontSize: 11, color: '#a7a7a7' }}>{song.artist}</div>
// //         </div>
// //         <button onClick={() => setLiked(!liked)} style={{
// //           background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
// //           color: liked ? '#ff4d6d' : '#6b6b6b', transition: 'all 0.2s ease',
// //         }}>
// //           <Heart size={16} fill={liked ? '#ff4d6d' : 'none'} />
// //         </button>
// //       </div>

// //       {/* Controls */}
// //       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
// //           <button onClick={() => setShuffled(!shuffled)} style={{
// //             background: 'none', border: 'none', cursor: 'pointer',
// //             color: shuffled ? '#1DB954' : '#6b6b6b', transition: 'color 0.2s',
// //           }}>
// //             <Shuffle size={16} />
// //           </button>
// //           <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a7a7a7' }}>
// //             <SkipBack size={20} />
// //           </button>
// //           <button onClick={onPlayPause} style={{
// //             width: 44, height: 44, borderRadius: '50%',
// //             background: 'white', border: 'none', cursor: 'pointer',
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             transition: 'transform 0.1s ease',
// //           }}
// //           onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'}
// //           onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
// //           >
// //             {isPlaying
// //               ? <Pause size={18} fill="black" color="black" />
// //               : <Play size={18} fill="black" color="black" style={{ marginLeft: 2 }} />}
// //           </button>
// //           <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a7a7a7' }}>
// //             <SkipForward size={20} />
// //           </button>
// //           <button onClick={() => setRepeated(!repeated)} style={{
// //             background: 'none', border: 'none', cursor: 'pointer',
// //             color: repeated ? '#1DB954' : '#6b6b6b', transition: 'color 0.2s',
// //           }}>
// //             <Repeat size={16} />
// //           </button>
// //         </div>

// //         {/* Seek */}
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 500 }}>
// //           <span style={{ fontSize: 11, color: '#6b6b6b', width: 36, textAlign: 'right' }}>1:09</span>
// //           <input type="range" min={0} max={100} value={progress}
// //             onChange={e => setProgress(Number(e.target.value))}
// //             className="progress-bar"
// //             style={{ flex: 1, accentColor: '#1DB954' }}
// //           />
// //           <span style={{ fontSize: 11, color: '#6b6b6b', width: 36 }}>{song.duration}</span>
// //         </div>
// //       </div>

// //       {/* Right controls */}
// //       <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 200, justifyContent: 'flex-end', flexShrink: 0 }}>
// //         <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }} title="Lyrics">
// //           <Mic size={15} />
// //         </button>
// //         <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }} title="Queue">
// //           <List size={15} />
// //         </button>
// //         <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }} title="Download">
// //           <Download size={15} />
// //         </button>
// //         <Volume2 size={15} color="#6b6b6b" />
// //         <input type="range" min={0} max={100} value={volume}
// //           onChange={e => setVolume(Number(e.target.value))}
// //           className="volume-bar"
// //           style={{ accentColor: '#1DB954' }}
// //         />
// //         <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}>
// //           <Maximize2 size={14} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Main App ─────────────────────────────────────────────────────────────────
// // export default function App() {
// //   const [activeSection, setActiveSection] = useState('home');
// //   const [currentSong, setCurrentSong] = useState<typeof trendingSongs[0] | null>(null);
// //   const [isPlaying, setIsPlaying] = useState(false);

// //   const playSong = (song?: typeof trendingSongs[0]) => {
// //     if (song) setCurrentSong(song);
// //     setIsPlaying(true);
// //   };

// //   return (
// //     <div style={{
// //       display: 'grid',
// //       gridTemplateColumns: 'var(--sidebar-width) 1fr 260px',
// //       gridTemplateRows: '1fr var(--player-height)',
// //       height: '100vh',
// //       fontFamily: 'var(--font-body)',
// //     }}>
// //       {/* Sidebar */}
// //       <div style={{ gridRow: '1', gridColumn: '1', overflow: 'hidden' }}>
// //         <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
// //       </div>

// //       {/* Main content */}
// //       <div style={{ gridRow: '1', gridColumn: '2', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
// //         <TopBar />
// //         <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
// //           <HeroBanner onPlay={() => playSong()} />
// //           <TrendingSongs onPlay={(song) => playSong(song)} />
// //           <PopularArtists />
// //           <FeaturedPlaylists onPlay={() => playSong()} />
// //           <NewReleases onPlay={() => playSong()} />
// //           <GenresSection />
// //           <RecentlyPlayedSection onPlay={() => playSong()} />
// //           <PremiumBanner />
// //           <div style={{ height: 40 }} />
// //         </div>
// //       </div>

// //       {/* Right sidebar */}
// //       <div style={{ gridRow: '1', gridColumn: '3', overflow: 'hidden' }}>
// //         <RightSidebar />
// //       </div>

// //       {/* Player */}
// //       <div style={{ gridRow: '2', gridColumn: '1 / -1' }}>
// //         <MusicPlayer
// //           currentSong={currentSong}
// //           isPlaying={isPlaying}
// //           onPlayPause={() => setIsPlaying(!isPlaying)}
// //         />
// //       </div>
// //     </div>
// //   );
// // }


// "use client";
// import React, { useState } from "react";

// const playlists = [
//   { id: 1, name: "Liked Songs", icon: "♥", count: 124 },
//   { id: 2, name: "Chill Vibes", icon: "🌊", count: 34 },
//   { id: 3, name: "Late Night Drive", icon: "🌙", count: 21 },
//   { id: 4, name: "Workout Beast", icon: "🔥", count: 47 },
//   { id: 5, name: "Sunday Morning", icon: "☀️", count: 18 },
//   { id: 6, name: "Focus Mode", icon: "🎯", count: 29 },
//   { id: 7, name: "Throwbacks", icon: "📼", count: 55 },
// ];

// const songs = [
//   { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20", plays: "3.2B", color: "#e63946" },
//   { id: 2, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:37", plays: "2.8B", color: "#f4a261" },
//   { id: 3, title: "Stay", artist: "Kid LAROI & Justin Bieber", album: "F*CK LOVE 3", duration: "2:21", plays: "2.5B", color: "#2a9d8f" },
//   { id: 4, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:24", plays: "2.2B", color: "#8338ec" },
//   { id: 5, title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", duration: "3:14", plays: "2.0B", color: "#06d6a0" },
//   { id: 6, title: "Montero", artist: "Lil Nas X", album: "Montero", duration: "2:17", plays: "1.8B", color: "#ffb703" },
//   { id: 7, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:59", plays: "1.7B", color: "#fb5607" },
//   { id: 8, title: "Peaches", artist: "Justin Bieber", album: "Justice", duration: "3:18", plays: "1.6B", color: "#3a86ff" },
//   { id: 9, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", duration: "3:36", plays: "1.5B", color: "#ff006e" },
//   { id: 10, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58", plays: "1.4B", color: "#8ecae6" },
// ];

// const featuredAlbums = [
//   { id: 1, name: "After Hours", artist: "The Weeknd", color: "#e63946", bg: "from-red-900" },
//   { id: 2, name: "Future Nostalgia", artist: "Dua Lipa", color: "#8338ec", bg: "from-purple-900" },
//   { id: 3, name: "Harry's House", artist: "Harry Styles", color: "#f4a261", bg: "from-orange-900" },
//   { id: 4, name: "SOUR", artist: "Olivia Rodrigo", color: "#8ecae6", bg: "from-blue-900" },
//   { id: 5, name: "Dreamland", artist: "Glass Animals", color: "#fb5607", bg: "from-orange-800" },
// ];

// export default function MusicHomePage() {
//   const [activeSong, setActiveSong] = useState<number | null>(3);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [activePlaylist, setActivePlaylist] = useState<number | null>(1);
//   const [progress, setProgress] = useState(38);
//   const [volume, setVolume] = useState(72);
//   const [liked, setLiked] = useState<Set<number>>(new Set([1, 3, 5]));

//   const currentSong = songs.find((s) => s.id === activeSong) || songs[2];

//   const toggleLike = (id: number) => {
//     setLiked((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   return (
//     <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="flex flex-col h-screen bg-[#0a0a0f] text-white overflow-hidden">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
//         .song-row:hover .song-index { display: none; }
//         .song-row:hover .play-icon { display: flex; }
//         .play-icon { display: none; }
//         .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.06); }
//         .progress-bar::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; background: white; border-radius: 50%; cursor: pointer; }
//         .progress-bar::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; }
//         @keyframes pulse-ring { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
//         .now-playing-dot { animation: pulse-ring 1.5s ease-in-out infinite; }
//         @keyframes bars { 0%,100% { height: 4px; } 50% { height: 14px; } }
//         .bar1 { animation: bars 0.8s ease-in-out infinite; }
//         .bar2 { animation: bars 0.8s ease-in-out infinite 0.2s; }
//         .bar3 { animation: bars 0.8s ease-in-out infinite 0.4s; }
//       `}</style>

//       {/* Main layout */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* LEFT SIDEBAR */}
//         <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0d0d14] border-r border-white/5">
//           {/* Logo */}
//           <div className="px-6 py-5 border-b border-white/5">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold">♪</div>
//               <span style={{ fontFamily: "'Space Mono', monospace" }} className="text-lg font-bold tracking-tight">WAVR</span>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav className="px-3 py-4 border-b border-white/5">
//             {[
//               { icon: "⊞", label: "Home", active: true },
//               { icon: "⊕", label: "Search" },
//               { icon: "◫", label: "Your Library" },
//             ].map((item) => (
//               <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${item.active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
//                 <span className="text-base">{item.icon}</span>
//                 {item.label}
//               </button>
//             ))}
//           </nav>

//           {/* Playlists */}
//           <div className="flex-1 overflow-y-auto px-3 py-4">
//             <div className="flex items-center justify-between px-3 mb-3">
//               <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Playlists</span>
//               <button className="text-zinc-500 hover:text-white text-lg leading-none transition-colors">+</button>
//             </div>
//             {playlists.map((pl) => (
//               <button
//                 key={pl.id}
//                 onClick={() => setActivePlaylist(pl.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 group ${activePlaylist === pl.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
//               >
//                 <span className="text-base w-6 text-center">{pl.icon}</span>
//                 <span className="flex-1 text-left truncate font-medium">{pl.name}</span>
//                 <span className="text-xs text-zinc-600 group-hover:text-zinc-400">{pl.count}</span>
//               </button>
//             ))}
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#111118] to-[#0a0a0f]">
//           {/* Header */}
//           <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-[#111118]/90 backdrop-blur-md border-b border-white/5">
//             <div className="flex items-center gap-2">
//               <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition-colors">←</button>
//               <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition-colors">→</button>
//             </div>
//             <div className="flex items-center gap-2 glass rounded-full px-1 py-1">
//               <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">A</div>
//               <span className="text-sm font-medium pr-3">Arjun</span>
//             </div>
//           </div>

//           <div className="px-8 py-6">
//             {/* Featured Albums */}
//             <section className="mb-8">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold">Featured</h2>
//                 <button className="text-xs text-zinc-500 hover:text-white transition-colors font-medium">See all →</button>
//               </div>
//               <div className="grid grid-cols-5 gap-4">
//                 {featuredAlbums.map((album) => (
//                   <div key={album.id} className="group cursor-pointer">
//                     <div className={`aspect-square rounded-xl bg-gradient-to-br ${album.bg} to-[#111118] flex items-end p-3 mb-2 relative overflow-hidden border border-white/5 hover:border-white/15 transition-all`}>
//                       <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 30%, ${album.color}, transparent 70%)` }} />
//                       <div className="relative">
//                         <div className="text-xs text-white/60 font-medium">{album.artist}</div>
//                         <div className="text-sm font-bold text-white truncate">{album.name}</div>
//                       </div>
//                       <button
//                         className="absolute right-2 bottom-2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg"
//                         style={{ background: album.color }}
//                       >
//                         ▶
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* All Songs */}
//             <section>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold">All Songs</h2>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-zinc-500">{songs.length} tracks</span>
//                 </div>
//               </div>

//               {/* Table Header */}
//               <div className="grid grid-cols-[40px_1fr_1fr_100px_80px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
//                 <span>#</span>
//                 <span>Title</span>
//                 <span>Album</span>
//                 <span className="text-right">Plays</span>
//                 <span className="text-right">⏱</span>
//               </div>

//               {/* Songs */}
//               <div className="space-y-0.5">
//                 {songs.map((song, idx) => {
//                   const isActive = song.id === activeSong;
//                   return (
//                     <div
//                       key={song.id}
//                       onClick={() => { setActiveSong(song.id); setIsPlaying(true); }}
//                       className={`song-row grid grid-cols-[40px_1fr_1fr_100px_80px] gap-4 px-4 py-3 rounded-lg items-center cursor-pointer group transition-all ${isActive ? "bg-white/8" : "hover:bg-white/5"}`}
//                     >
//                       {/* Index / Play */}
//                       <div className="relative flex items-center justify-center">
//                         <span className={`song-index text-sm font-mono ${isActive ? "text-emerald-400" : "text-zinc-500"}`}>
//                           {isActive && isPlaying ? (
//                             <span className="flex items-end gap-[2px] h-4">
//                               <span className="bar1 w-[3px] bg-emerald-400 rounded-sm inline-block" />
//                               <span className="bar2 w-[3px] bg-emerald-400 rounded-sm inline-block" />
//                               <span className="bar3 w-[3px] bg-emerald-400 rounded-sm inline-block" />
//                             </span>
//                           ) : (
//                             idx + 1
//                           )}
//                         </span>
//                         <span className="play-icon absolute items-center justify-center text-white text-sm">▶</span>
//                       </div>

//                       {/* Title + Artist */}
//                       <div className="flex items-center gap-3 min-w-0">
//                         <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-bold" style={{ background: `${song.color}22`, border: `1px solid ${song.color}44` }}>
//                           <span style={{ color: song.color }}>♪</span>
//                         </div>
//                         <div className="min-w-0">
//                           <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "text-white"}`}>{song.title}</div>
//                           <div className="text-xs text-zinc-500 truncate">{song.artist}</div>
//                         </div>
//                       </div>

//                       {/* Album */}
//                       <div className="text-sm text-zinc-500 truncate">{song.album}</div>

//                       {/* Plays */}
//                       <div className="text-sm text-zinc-500 text-right font-mono">{song.plays}</div>

//                       {/* Duration + Like */}
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
//                           className={`text-sm opacity-0 group-hover:opacity-100 transition-all ${liked.has(song.id) ? "opacity-100 text-emerald-400" : "text-zinc-500 hover:text-white"}`}
//                         >
//                           {liked.has(song.id) ? "♥" : "♡"}
//                         </button>
//                         <span className="text-sm text-zinc-500 font-mono">{song.duration}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           </div>
//         </main>

//         {/* RIGHT PANEL - Now Playing */}
//         <aside className="w-72 flex-shrink-0 bg-[#0d0d14] border-l border-white/5 flex flex-col">
//           <div className="px-6 py-5 border-b border-white/5">
//             <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Now Playing</span>
//           </div>

//           {/* Album Art */}
//           <div className="px-6 pt-6 pb-4">
//             <div
//               className="aspect-square rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden mb-4"
//               style={{ background: `linear-gradient(135deg, ${currentSong.color}33, ${currentSong.color}11)`, border: `1px solid ${currentSong.color}33` }}
//             >
//               <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 40%, ${currentSong.color}55, transparent 70%)` }} />
//               <span className="relative" style={{ color: currentSong.color }}>♪</span>
//               {isPlaying && (
//                 <div className="absolute bottom-3 right-3 flex items-end gap-[3px]">
//                   <span className="bar1 w-[4px] rounded-sm inline-block" style={{ background: currentSong.color }} />
//                   <span className="bar2 w-[4px] rounded-sm inline-block" style={{ background: currentSong.color }} />
//                   <span className="bar3 w-[4px] rounded-sm inline-block" style={{ background: currentSong.color }} />
//                 </div>
//               )}
//             </div>

//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <div className="font-bold text-base leading-tight">{currentSong.title}</div>
//                 <div className="text-sm text-zinc-500 mt-0.5">{currentSong.artist}</div>
//               </div>
//               <button onClick={() => toggleLike(currentSong.id)} className={`text-xl transition-colors mt-0.5 ${liked.has(currentSong.id) ? "text-emerald-400" : "text-zinc-600 hover:text-white"}`}>
//                 {liked.has(currentSong.id) ? "♥" : "♡"}
//               </button>
//             </div>

//             {/* Progress */}
//             <div className="mb-4">
//               <input
//                 type="range" min={0} max={100} value={progress}
//                 onChange={(e) => setProgress(Number(e.target.value))}
//                 className="progress-bar w-full h-1 rounded-full outline-none cursor-pointer"
//                 style={{ background: `linear-gradient(to right, ${currentSong.color} ${progress}%, #333 ${progress}%)` }}
//               />
//               <div className="flex justify-between text-xs text-zinc-600 mt-1 font-mono">
//                 <span>1:{String(Math.floor(progress * 0.6)).padStart(2, "0")}</span>
//                 <span>{currentSong.duration}</span>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center justify-between mb-6">
//               <button className="text-zinc-500 hover:text-white transition-colors text-sm">⇄</button>
//               <button className="text-zinc-400 hover:text-white transition-colors text-lg">⏮</button>
//               <button
//                 onClick={() => setIsPlaying(!isPlaying)}
//                 className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-105 active:scale-95"
//                 style={{ background: currentSong.color }}
//               >
//                 {isPlaying ? "⏸" : "▶"}
//               </button>
//               <button className="text-zinc-400 hover:text-white transition-colors text-lg">⏭</button>
//               <button className="text-zinc-500 hover:text-white transition-colors text-sm">↻</button>
//             </div>

//             {/* Volume */}
//             <div className="flex items-center gap-3">
//               <span className="text-zinc-500 text-sm">🔈</span>
//               <input
//                 type="range" min={0} max={100} value={volume}
//                 onChange={(e) => setVolume(Number(e.target.value))}
//                 className="progress-bar flex-1 h-1 rounded-full outline-none cursor-pointer"
//                 style={{ background: `linear-gradient(to right, #666 ${volume}%, #222 ${volume}%)` }}
//               />
//               <span className="text-zinc-500 text-sm">🔊</span>
//             </div>
//           </div>

//           {/* Queue */}
//           <div className="flex-1 overflow-y-auto border-t border-white/5 px-4 py-4">
//             <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-2">Up Next</div>
//             {songs.filter((s) => s.id !== activeSong).slice(0, 5).map((song) => (
//               <button
//                 key={song.id}
//                 onClick={() => setActiveSong(song.id)}
//                 className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/5 transition-all group"
//               >
//                 <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs" style={{ background: `${song.color}22`, color: song.color }}>♪</div>
//                 <div className="min-w-0 flex-1 text-left">
//                   <div className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">{song.title}</div>
//                   <div className="text-xs text-zinc-600 truncate">{song.artist}</div>
//                 </div>
//                 <span className="text-xs text-zinc-600 font-mono">{song.duration}</span>
//               </button>
//             ))}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

'use client'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import MusicHomePage from "./(home)/MusicHomePage"
import { GetSongs, ISong } from "@/components/song-module/controller"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [songs, setSongs] = useState<ISong[]>([])

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // ✅ Tara config ma session.user.token che
      const token = session.user.token as string

      console.log("TOKEN:", token) // check karo

      GetSongs(token)
        .then(res => setSongs(res.data ?? []))
        .catch(err => console.error(err))
    }

  }, [status, session])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <div className="text-4xl mb-3">🎵</div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return <MusicHomePage songs={songs} />
}