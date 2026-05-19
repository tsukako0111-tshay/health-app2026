import { useState, useEffect } from "react";

const KEYS = {
  meals: "hk-meals-v1",
  weights: "hk-weights-v1",
  bowels: "hk-bowels-v1",
  periods: "hk-periods-v1",
};

const TARGET = 1500;
const DOW = ["日","月","火","水","木","金","土"];
const BOWEL_STATES = ["普通","硬め","軟らかめ","下痢","コロコロ"];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmtJP(ds) {
  const d = new Date(ds + "T00:00:00");
  return `${d.getMonth()+1}月${d.getDate()}日（${DOW[d.getDay()]}）`;
}
function addDays(ds, n) {
  const d = new Date(ds + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function diffDays(a, b) {
  return Math.round((new Date(b+"T00:00:00") - new Date(a+"T00:00:00")) / 86400000);
}

async function load(key, def) {
  try {
    const r = await window.storage.get(key);
    return r?.value ? JSON.parse(r.value) : def;
  } catch { return def; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

export default function App() {
  const [meals,   setMeals]   = useState({
    "2026-05-14": [
      {id:"f101",name:"【朝】クロワッサンハムチーズサンド（山崎パン）",kcal:235},
      {id:"f102",name:"【朝】ハッシュポテト",kcal:136},
      {id:"f103",name:"【朝】卵かけごはん1/4（ごはん40g・卵1/4個）",kcal:81},
      {id:"f104",name:"【朝】カフェラテ",kcal:30},
      {id:"f105",name:"【昼】レトルトカルボナーラ（パスタ）",kcal:362},
      {id:"f106",name:"【昼】カルボナーラソース1/2",kcal:76},
      {id:"f107",name:"【昼】ベーコン1枚",kcal:20},
      {id:"f108",name:"【昼】ミニトマト2個",kcal:7},
      {id:"f109",name:"【昼】コクとろ豆腐1個",kcal:35},
      {id:"f110",name:"【昼】無糖ヨーグルト+はちみつ",kcal:83},
      {id:"f111",name:"【夜】ナス・ピーマン・えのきの揚げ浸し1/5量",kcal:124},
      {id:"f112",name:"【夜】ご飯65g",kcal:109},
      {id:"f113",name:"【夜】温泉卵",kcal:70},
      {id:"f114",name:"【夜】長芋ソーセージのマスタード炒め1/4量",kcal:210},
    ],
    "2026-05-15": [
      {id:"f201",name:"【朝】筍ごはん150g",kcal:280},
      {id:"f202",name:"【朝】無糖ヨーグルト+はちみつ",kcal:83},
      {id:"f203",name:"【朝】カフェラテ",kcal:30},
      {id:"f204",name:"【昼】お弁当・筍ごはん170g",kcal:300},
      {id:"f205",name:"【昼】お弁当・かに玉（卵2/3個分）",kcal:133},
      {id:"f206",name:"【昼】お弁当・長芋ソーセージ炒め1/10量",kcal:56},
      {id:"f207",name:"【昼】お弁当・揚げ浸し1/15量",kcal:41},
      {id:"f208",name:"【昼】お弁当・ミニトマト2個",kcal:7},
      {id:"f209",name:"【昼】ラスク1枚",kcal:50},
      {id:"f210",name:"【昼】カフェラテ",kcal:30},
      {id:"f211",name:"【夜】焼き鮭80g",kcal:149},
      {id:"f212",name:"【夜】マグロ刺身2枚",kcal:30},
      {id:"f213",name:"【夜】ミニトマト・キャベツのサラダ50g",kcal:12},
      {id:"f214",name:"【夜】こだわり酒場しびれもん半分",kcal:60},
      {id:"f215",name:"【夜】白米50g",kcal:84},
      {id:"f216",name:"【夜】アボカド1/2個+わさび醤油",kcal:131},
    ],
    "2026-05-16": [
      {id:"f301",name:"【朝】卵かけごはん（白米150g）",kcal:318},
      {id:"f302",name:"【朝】カフェラテ",kcal:30},
      {id:"f303",name:"【昼】ベーコンレタスバーガー",kcal:374},
      {id:"f304",name:"【昼】ポテトS×4/5",kcal:180},
      {id:"f305",name:"【昼】ナゲット4個",kcal:188},
      {id:"f306",name:"【昼】グリマスシェイクS×1/3",kcal:73},
      {id:"f307",name:"【昼】アイスカフェラテ（オリゴ糖3ml）",kcal:35},
      {id:"f308",name:"【夜】マシュマロチョコパン半分",kcal:245},
      {id:"f309",name:"【夜】アイスカフェラテ（牛乳100ml・オリゴ糖5ml）",kcal:75},
      {id:"f310",name:"【夜】つけ麺（麺80g・もやし150g・つけ汁半量）",kcal:179},
    ],
    "2026-05-17": [
      {id:"f401",name:"【朝】食パン5枚切り+チーズ30g+はちみつ 半分",kcal:190},
      {id:"f402",name:"【朝】無糖ヨーグルト+はちみつ",kcal:83},
      {id:"f403",name:"【朝】アメリカンドッグ",kcal:133},
      {id:"f404",name:"【朝】ごまいりこ3g",kcal:12},
      {id:"f405",name:"【朝】ホットカフェラテ",kcal:30},
      {id:"f406",name:"【朝】ピザパン1/3",kcal:83},
      {id:"f407",name:"【昼】日清 海鮮中華そばオイスターソース",kcal:460},
      {id:"f408",name:"【間食】アイスカフェラテ（牛乳100ml・オリゴ糖5ml）",kcal:75},
      {id:"f409",name:"【間食】パイの実2粒",kcal:36},
      {id:"f410",name:"【間食】アルフォート1枚",kcal:26},
      {id:"f411",name:"【夜】白米85g",kcal:143},
      {id:"f412",name:"【夜】イカゲソ唐揚げ30g",kcal:60},
      {id:"f413",name:"【夜】ささみ明太子チーズ焼き2本分",kcal:284},
      {id:"f414",name:"【夜】キャロットラペ1/10量",kcal:44},
      {id:"f415",name:"【夜】ミニトマト2個",kcal:7},
      {id:"f416",name:"【夜】ゴロッとサーモン丼20g",kcal:25},
      {id:"f417",name:"【夜】アルパカスパークリング350ml缶",kcal:175},
    ],
    "2026-05-18": [
      {id:"f501",name:"【朝】食パン5枚切り1/2+とろとろたまご1/2",kcal:161},
      {id:"f502",name:"【朝】無糖ヨーグルト+はちみつ",kcal:83},
      {id:"f503",name:"【朝】ごまいりこ5g",kcal:19},
      {id:"f504",name:"【朝】ホットカフェラテ",kcal:30},
      {id:"f505",name:"【朝】ミニピッツァ1/2枚",kcal:79},
      {id:"f506",name:"【昼】糖朝 海老ワンタンと夏野菜の冷麺セット",kcal:575},
      {id:"f507",name:"【間食】タリーズ アイスカフェラテ トール シロップ1つ",kcal:175},
      {id:"f508",name:"【夜】大起水産 イカ2貫",kcal:72},
      {id:"f509",name:"【夜】大起水産 カニサラダ2貫",kcal:100},
      {id:"f510",name:"【夜】大起水産 たまご2貫",kcal:110},
      {id:"f511",name:"【夜】大起水産 サーモン2貫",kcal:112},
      {id:"f512",name:"【夜】大起水産 オクラ糸カツオ2貫",kcal:70},
      {id:"f513",name:"【夜】大起水産 いなり2貫",kcal:150},
      {id:"f514",name:"【夜】大起水産 ネギトロ1貫",kcal:50},
      {id:"f515",name:"【夜】大起水産 うなぎ2貫（シャリ小さめ）",kcal:130},
    ],
    "2026-05-19": [
      {id:"f601",name:"【朝】食パン5枚切り1/2+とろとろたまご1/2",kcal:161},
      {id:"f602",name:"【朝】無糖ヨーグルト+はちみつ",kcal:83},
      {id:"f603",name:"【朝】ごまいりこ 5g",kcal:19},
      {id:"f604",name:"【朝】ホットカフェラテ",kcal:30},
      {id:"f605",name:"【朝】ミニピッツァ 1/2枚",kcal:79},
      {id:"f606",name:"【昼】糖朝 海老ワンタンと夏野菜の冷麺セット",kcal:575},
      {id:"f607",name:"【間食】タリーズ アイスカフェラテ トール シロップ1つ",kcal:175},
      {id:"f608",name:"【夜】大起水産 イカ 2貫",kcal:72},
      {id:"f609",name:"【夜】大起水産 カニサラダ 2貫",kcal:100},
      {id:"f610",name:"【夜】大起水産 たまご 2貫",kcal:110},
      {id:"f611",name:"【夜】大起水産 サーモン 2貫",kcal:112},
      {id:"f612",name:"【夜】大起水産 オクラ糸カツオ 2貫",kcal:70},
      {id:"f613",name:"【夜】大起水産 いなり 2貫",kcal:150},
      {id:"f614",name:"【夜】大起水産 ネギトロ 1貫",kcal:50},
      {id:"f615",name:"【夜】大起水産 うなぎ 2貫（シャリ小さめ）",kcal:130},
    ],
  });
  const [weights, setWeights] = useState({"2026-05-14":64.0,"2026-05-15":63.8,"2026-05-16":63.1,"2026-05-18":63.4,"2026-05-19":63.4});
  const [bowels,  setBowels]  = useState({"2026-05-15":{count:1,state:"普通"},"2026-05-16":{count:1,state:"コロコロ"},"2026-05-18":{count:0,state:"コロコロ"}});
  const [periods, setPeriods] = useState([{start:"2026-05-07",end:"2026-05-11"}]);
// const [ready,   setReady]   = useState(false);

  const [view,    setView]    = useState("cal");
  const [selDate, setSelDate] = useState(today());
  const [calYM,   setCalYM]   = useState(() => { const n = new Date(); return { y: n.getFullYear(), m: n.getMonth() }; });

  const [newName, setNewName] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [aiText,  setAiText]  = useState("");
  const [aiRes,   setAiRes]   = useState(null);
  const [aiLoad,  setAiLoad]  = useState(false);
  const [aiErr,   setAiErr]   = useState("");

  const [wVal,    setWVal]    = useState("");
  const [wEdit,   setWEdit]   = useState(false);
  const [bCount,  setBCount]  = useState(1);
  const [bState,  setBState]  = useState("普通");
  const [bEdit,   setBEdit]   = useState(false);
  const [pS,      setPS]      = useState("");
  const [pE,      setPE]      = useState("");
  const [pIdx,    setPIdx]    = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const sm = await load(KEYS.meals, {});
        setMeals(m => {
          const merged = {...m};
          Object.keys(sm).forEach(date => {
            const newItems = (sm[date]||[]).filter(si => !(m[date]||[]).some(mi => mi.id === si.id));
            if (newItems.length > 0) merged[date] = [...(merged[date]||[]), ...newItems];
          });
          return merged;
        });
      } catch {}
      try {
        const sw = await load(KEYS.weights, {});
        setWeights(w => {
          const merged = {...w};
          Object.keys(sw).forEach(d => { if (!merged[d]) merged[d] = sw[d]; });
          return merged;
        });
      } catch {}
      try {
        const sb = await load(KEYS.bowels, {});
        setBowels(b => {
          const merged = {...b};
          Object.keys(sb).forEach(d => { if (!merged[d]) merged[d] = sb[d]; });
          return merged;
        });
      } catch {}
      try {
        const sp = await load(KEYS.periods, []);
        setPeriods(p => {
          const starts = new Set(p.map(x => x.start));
          const extra = sp.filter(x => !starts.has(x.start));
          return [...p, ...extra];
        });
      } catch {}
      setReady(true);
    })();
  }, []);

  const dayMeals = meals[selDate] || [];
  const total = dayMeals.reduce((s, m) => s + Number(m.kcal), 0);
  const pct = Math.min(total / TARGET * 100, 100);
  const barCol = pct >= 100 ? "#e05c5c" : pct >= 80 ? "#f0a050" : "#4a9e72";

  const FIXED_IDS = new Set(Object.values(meals).flat().filter(m => m.id.startsWith("f")).map(m => m.id));
  const FIXED_WEIGHT_DATES = new Set(["2026-05-14","2026-05-15","2026-05-16","2026-05-18"]);
  const FIXED_BOWEL_DATES  = new Set(["2026-05-15","2026-05-16"]);
  const FIXED_PERIOD_STARTS= new Set(["2026-05-07"]);

  const saveMeals = (v) => {
    setMeals(v);
    const toSave = {};
    Object.keys(v).forEach(date => {
      const extra = (v[date]||[]).filter(m => !FIXED_IDS.has(m.id));
      if (extra.length > 0) toSave[date] = extra;
    });
    save(KEYS.meals, toSave);
  };
  const saveW = (v) => {
    setWeights(v);
    const toSave = {};
    Object.keys(v).forEach(d => { if (!FIXED_WEIGHT_DATES.has(d)) toSave[d] = v[d]; });
    save(KEYS.weights, toSave);
  };
  const saveB = (v) => {
    setBowels(v);
    const toSave = {};
    Object.keys(v).forEach(d => { if (!FIXED_BOWEL_DATES.has(d)) toSave[d] = v[d]; });
    save(KEYS.bowels, toSave);
  };
  const saveP = (v) => {
    setPeriods(v);
    const toSave = v.filter(p => !FIXED_PERIOD_STARTS.has(p.start));
    save(KEYS.periods, toSave);
  };

  const addMeal = () => {
    if (!newName || !newKcal) return;
    const updated = { ...meals, [selDate]: [...dayMeals, { id: `m${Date.now()}`, name: newName, kcal: Number(newKcal) }] };
    saveMeals(updated);
    setNewName(""); setNewKcal("");
  };
  const delMeal = (id) => {
    saveMeals({ ...meals, [selDate]: dayMeals.filter(m => m.id !== id) });
  };

  const runAI = async () => {
    if (!aiText.trim()) return;
    setAiLoad(true); setAiErr(""); setAiRes(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `以下の食事内容をJSONのみで返してください。\`\`\`不要。形式:[{"name":"食品名","kcal":数値},...]\n${aiText}` }],
        }),
      });
      const data = await res.json();
      const txt = data.content.map(c => c.text || "").join("").replace(/```json|```/g,"").trim();
      setAiRes(JSON.parse(txt));
    } catch { setAiErr("解析できませんでした。"); }
    finally { setAiLoad(false); }
  };
  const commitAI = () => {
    if (!aiRes) return;
    const items = aiRes.map(i => ({ ...i, id: `m${Date.now()}${Math.random()}` }));
    saveMeals({ ...meals, [selDate]: [...dayMeals, ...items] });
    setAiText(""); setAiRes(null);
  };

  const commitW = () => {
    const v = parseFloat(wVal);
    if (isNaN(v) || v < 30 || v > 200) return;
    saveW({ ...weights, [selDate]: v });
    setWVal(""); setWEdit(false);
  };
  const commitB = () => {
    saveB({ ...bowels, [selDate]: { count: bCount, state: bState } });
    setBEdit(false);
  };
  const delB = () => {
    const n = { ...bowels }; delete n[selDate]; saveB(n);
  };

  const sortedPeriods = [...periods].sort((a, b) => b.start.localeCompare(a.start));
  const nextPeriod = () => {
    if (!sortedPeriods.length) return null;
    if (sortedPeriods.length >= 2) {
      const cyc = [];
      for (let i = 0; i < Math.min(sortedPeriods.length - 1, 3); i++)
        cyc.push(diffDays(sortedPeriods[i+1].start, sortedPeriods[i].start));
      return addDays(sortedPeriods[0].start, Math.round(cyc.reduce((s,c) => s+c, 0) / cyc.length));
    }
    return addDays(sortedPeriods[0].start, 28);
  };
  const isPeriod = (ds) => sortedPeriods.some(p => ds >= p.start && ds <= (p.end || p.start));
  const commitP = () => {
    if (!pS) return;
    const entry = { start: pS, end: pE || null };
    const updated = pIdx !== null ? periods.map((p,i) => i === pIdx ? entry : p) : [...periods, entry];
    saveP(updated); setPS(""); setPE(""); setPIdx(null);
  };

  const nextD = nextPeriod();
  const { y, m } = calYM;
  const allDates = Object.keys(meals).filter(d => (meals[d]||[]).length > 0).sort((a,b) => b.localeCompare(a));

  const cells = [
    ...Array(new Date(y, m, 1).getDay()).fill(null),
    ...Array.from({ length: new Date(y, m+1, 0).getDate() }, (_, i) => i+1),
  ];

  const TABS = [["cal","📅"],["rec","✏️"],["hist","📋"],["per","🌸"]];
  const TAB_LABELS = { cal:"カレンダー", rec:"記録", hist:"履歴", per:"生理" };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.headerTop}>
          <span style={s.logo}>🥗</span>
          <span style={s.appName}>健康記録</span>
        </div>
        <div style={s.tabs}>
          {TABS.map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ ...s.tab, ...(view === v ? s.tabOn : {}) }}>
              {icon}
              <span style={s.tabLabel}>{TAB_LABELS[v]}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={s.body}>
        {view === "cal" && (
          <>
            <div style={s.card}>
              <div style={s.navRow}>
                <button onClick={() => setCalYM(({y,m}) => m===0?{y:y-1,m:11}:{y,m:m-1})} style={s.navBtn}>‹</button>
                <span style={s.navTitle}>{y}年{m+1}月</span>
                <button onClick={() => setCalYM(({y,m}) => m===11?{y:y+1,m:0}:{y,m:m+1})} style={s.navBtn}>›</button>
              </div>
              {nextD && (
                <div style={s.periodBanner}>🌸 次回生理予測日：{fmtJP(nextD)}</div>
              )}
              <div style={s.calGrid}>
                {DOW.map((d,i) => (
                  <div key={d} style={{ ...s.dowCell, color: i===0?"#e05c5c":i===6?"#4a7ee0":"#888" }}>{d}</div>
                ))}
                {cells.map((day, idx) => {
                  if (!day) return <div key={`e${idx}`} />;
                  const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const dk = (meals[ds]||[]).reduce((s,x) => s+Number(x.kcal), 0);
                  const dw = weights[ds];
                  const db = bowels[ds];
                  const hp = isPeriod(ds);
                  const isNext = nextD === ds;
                  const isT = ds === today();
                  const isSel = ds === selDate;
                  const dow = new Date(ds+"T00:00:00").getDay();
                  return (
                    <div key={ds} onClick={() => { setSelDate(ds); setView("rec"); }}
                      style={{
                        ...s.calCell,
                        ...(isSel ? s.calSel : {}),
                        ...(isT ? s.calToday : {}),
                        ...(hp ? { background: "#fff0f3" } : {}),
                        ...(isNext && !hp ? { outline: "1px dashed #f48fb1" } : {}),
                      }}>
                      <span style={{ fontSize:"0.8rem", fontWeight: isT?700:400, color: dow===0?"#e05c5c":dow===6?"#4a7ee0":"#333" }}>{day}</span>
                      {dk > 0 && <span style={{ fontSize:"0.57rem", fontWeight:700, color: dk>TARGET?"#e05c5c":"#4a9e72", lineHeight:1.2 }}>{dk}</span>}
                      {dw && <span style={{ fontSize:"0.53rem", color:"#7aaa90", lineHeight:1.2 }}>{dw}kg</span>}
                      <div style={{ display:"flex", gap:1, alignItems:"center", marginTop:1 }}>
                        {db && <span style={{ width:6, height:6, borderRadius:"50%", background:"#8d6e63", display:"inline-block" }} />}
                        {hp && <span style={{ fontSize:"0.58rem" }}>🩸</span>}
                        {isNext && !hp && <span style={{ fontSize:"0.58rem" }}>🌸</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ ...s.card, padding:"10px 16px" }}>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <span style={s.legend}><span style={{ color:"#4a9e72", fontWeight:700 }}>緑</span>=kcal目標内</span>
                <span style={s.legend}><span style={{ color:"#e05c5c", fontWeight:700 }}>赤</span>=超過</span>
                <span style={s.legend}><span style={{ width:7, height:7, borderRadius:"50%", background:"#8d6e63", display:"inline-block", marginRight:2 }}/>排便　🩸生理　🌸予測</span>
              </div>
            </div>
          </>
        )}

        {view === "rec" && (
          <>
            <div style={s.card}>
              <div style={s.cardLabel}>📅 日付</div>
              <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} style={s.input} />
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>⚖️ 体重</div>
              {weights[selDate] && !wEdit ? (
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:"1.6rem", fontWeight:700, color:"#2a5a3a" }}>{weights[selDate]}<span style={{ fontSize:"1rem", color:"#888", marginLeft:4 }}>kg</span></span>
                  <button onClick={() => { setWVal(String(weights[selDate])); setWEdit(true); }} style={s.ghostBtn}>修正</button>
                </div>
              ) : (
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <input type="number" step="0.1" placeholder="64.0" value={wVal} onChange={e => setWVal(e.target.value)} style={{ ...s.input, flex:1 }} />
                  <span style={{ color:"#888" }}>kg</span>
                  <button onClick={commitW} style={s.smBtn}>保存</button>
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>🟤 排便</div>
              {bowels[selDate] && !bEdit ? (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"1rem", color:"#6d4c41", fontWeight:700 }}>{bowels[selDate].count}回 <span style={{ fontWeight:400, color:"#999", fontSize:"0.88rem" }}>{bowels[selDate].state}</span></span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { setBCount(bowels[selDate].count); setBState(bowels[selDate].state); setBEdit(true); }} style={s.ghostBtn}>修正</button>
                    <button onClick={delB} style={{ ...s.ghostBtn, color:"#e05c5c", borderColor:"#e05c5c" }}>削除</button>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:"0.85rem", color:"#666" }}>回数</span>
                    <button onClick={() => setBCount(c => Math.max(1,c-1))} style={s.cntBtn}>−</button>
                    <span style={{ fontWeight:700, fontSize:"1.1rem", minWidth:20, textAlign:"center" }}>{bCount}</span>
                    <button onClick={() => setBCount(c => c+1)} style={s.cntBtn}>＋</button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {BOWEL_STATES.map(st => (
                      <button key={st} onClick={() => setBState(st)}
                        style={{ ...s.chip, ...(bState===st ? s.chipOn : {}) }}>{st}</button>
                    ))}
                  </div>
                  <button onClick={commitB} style={s.btn}>保存</button>
                  {bEdit && <button onClick={() => setBEdit(false)} style={{ ...s.btn, background:"#ccc" }}>キャンセル</button>}
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontSize:"2.2rem", fontWeight:700, color:"#1a1a1a", letterSpacing:"-1px" }}>{total}</span>
                <span style={{ fontSize:"0.9rem", color:"#aaa" }}>/ {TARGET} kcal</span>
              </div>
              <div style={{ background:"#eee", borderRadius:99, height:10, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:99, width:`${pct}%`, background:barCol, transition:"width 0.4s" }} />
              </div>
              <p style={{ fontSize:"0.85rem", fontWeight:700, textAlign:"right", color: total>TARGET?"#e05c5c":"#4a9e72", margin:0 }}>
                {total <= TARGET ? `残り ${TARGET-total} kcal` : `${total-TARGET} kcal オーバー`}
              </p>
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>🤖 AIで解析</div>
              <textarea value={aiText} onChange={e => setAiText(e.target.value)}
                placeholder="例：ご飯150g、焼き鮭80g、味噌汁1杯"
                style={{ ...s.input, minHeight:72, resize:"vertical" }} />
              <button onClick={runAI} disabled={aiLoad} style={s.btn}>{aiLoad ? "解析中…" : "解析する"}</button>
              {aiErr && <p style={{ color:"#e05c5c", fontSize:"0.85rem", margin:0 }}>{aiErr}</p>}
              {aiRes && (
                <div style={{ background:"#f4fbf7", borderRadius:10, padding:12, display:"flex", flexDirection:"column", gap:6 }}>
                  {aiRes.map((it,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.88rem" }}>
                      <span>{it.name}</span><span style={s.badge}>{it.kcal} kcal</span>
                    </div>
                  ))}
                  <div style={{ fontWeight:700, color:"#2a5a3a", fontSize:"0.9rem", borderTop:"1px solid #c8e6d4", paddingTop:6 }}>
                    合計: {aiRes.reduce((s,i) => s+i.kcal, 0)} kcal
                  </div>
                  <button onClick={commitAI} style={s.btn}>✅ 追加する</button>
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>✏️ 手動で追加</div>
              <input type="text" placeholder="食品名" value={newName} onChange={e => setNewName(e.target.value)} style={s.input} />
              <input type="number" placeholder="kcal" value={newKcal} onChange={e => setNewKcal(e.target.value)} style={s.input} />
              <button onClick={addMeal} style={s.btn}>追加</button>
            </div>

            <div style={s.card}>
              <div style={s.cardLabel}>🍽️ {fmtJP(selDate)}</div>
              {dayMeals.length === 0
                ? <p style={{ color:"#ccc", textAlign:"center", fontSize:"0.88rem", padding:"8px 0", margin:0 }}>まだ記録がありません</p>
                : dayMeals.map(meal => (
                  <div key={meal.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid #f0ece6" }}>
                    <span style={{ fontSize:"0.87rem", color:"#333", flex:1, marginRight:8 }}>{meal.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={s.badge}>{meal.kcal}</span>
                      <button onClick={() => delMeal(meal.id)} style={{ background:"none", border:"none", color:"#ccc", cursor:"pointer", fontSize:"0.9rem", padding:"0 2px" }}>✕</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        )}

        {view === "hist" && (
          <>
            {allDates.length === 0
              ? <div style={s.card}><p style={{ color:"#ccc", textAlign:"center", padding:"12px 0", margin:0 }}>記録がありません</p></div>
              : allDates.map(date => {
                const dm = meals[date] || [];
                const dk = dm.reduce((s,x) => s+Number(x.kcal), 0);
                const dp = Math.min(dk/TARGET*100, 100);
                const dc = dp>=100?"#e05c5c":dp>=80?"#f0a050":"#4a9e72";
                const dw = weights[date];
                const db = bowels[date];
                return (
                  <div key={date} style={s.card}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:700, fontSize:"0.9rem", color:"#222" }}>{fmtJP(date)}</span>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        {dw && <span style={{ fontSize:"0.8rem", color:"#7aaa90", fontWeight:700 }}>{dw}kg</span>}
                        {db && <span style={{ fontSize:"0.78rem", color:"#8d6e63" }}><span style={{ width:6, height:6, borderRadius:"50%", background:"#8d6e63", display:"inline-block", marginRight:2 }}/>{db.count}回</span>}
                        <span style={{ fontWeight:700, color:dc, fontSize:"0.9rem" }}>{dk}kcal</span>
                      </div>
                    </div>
                    <div style={{ background:"#eee", borderRadius:99, height:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:99, width:`${dp}%`, background:dc }} />
                    </div>
                    {dm.map(meal => (
                      <div key={meal.id} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", borderBottom:"1px solid #f5f0eb" }}>
                        <span style={{ fontSize:"0.83rem", color:"#555" }}>{meal.name}</span>
                        <span style={{ fontSize:"0.83rem", color:"#999" }}>{meal.kcal}</span>
                      </div>
                    ))}
                  </div>
                );
              })
            }
          </>
        )}

        {view === "per" && (
          <>
            {nextD && (
              <div style={{ ...s.card, background:"#fff0f6", border:"1px solid #f8bbd0" }}>
                <div style={{ fontWeight:700, color:"#c2185b", fontSize:"0.9rem" }}>🌸 次回予測日</div>
                <div style={{ fontSize:"1.2rem", fontWeight:700, color:"#ad1457" }}>{fmtJP(nextD)}</div>
                <div style={{ fontSize:"0.73rem", color:"#f48fb1" }}>{periods.length >= 2 ? "過去の周期から計算" : "平均28日周期で計算"}</div>
              </div>
            )}
            <div style={s.card}>
              <div style={s.cardLabel}>🌸 {pIdx !== null ? "記録を修正" : "記録を追加"}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:"0.83rem", color:"#888", minWidth:44 }}>開始日</span>
                <input type="date" value={pS} onChange={e => setPS(e.target.value)} style={{ ...s.input, flex:1 }} />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:"0.83rem", color:"#888", minWidth:44 }}>終了日</span>
                <input type="date" value={pE} onChange={e => setPE(e.target.value)} style={{ ...s.input, flex:1 }} />
              </div>
              <button onClick={commitP} style={{ ...s.btn, background:"#e91e8c" }}>{pIdx !== null ? "更新" : "追加"}</button>
              {pIdx !== null && <button onClick={() => { setPS(""); setPE(""); setPIdx(null); }} style={{ ...s.btn, background:"#ccc" }}>キャンセル</button>}
            </div>
            <div style={s.card}>
              <div style={s.cardLabel}>📋 記録一覧</div>
              {sortedPeriods.length === 0
                ? <p style={{ color:"#ccc", textAlign:"center", fontSize:"0.88rem", margin:0 }}>記録がありません</p>
                : sortedPeriods.map((p, i) => {
                  const dur = p.end ? diffDays(p.start, p.end) + 1 : null;
                  const origIdx = periods.indexOf(p);
                  return (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #fce4ec" }}>
                      <div>
                        <span style={{ fontWeight:700, color:"#ad1457", fontSize:"0.87rem" }}>{fmtJP(p.start)}</span>
                        {p.end && <span style={{ color:"#999", fontSize:"0.82rem" }}> 〜 {fmtJP(p.end)}</span>}
                        {dur && <span style={{ color:"#f48fb1", fontSize:"0.77rem", marginLeft:4 }}>({dur}日間)</span>}
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => { setPS(p.start); setPE(p.end||""); setPIdx(origIdx); }} style={s.ghostBtn}>修正</button>
                        <button onClick={() => saveP(periods.filter((_,j) => j !== origIdx))} style={{ ...s.ghostBtn, color:"#e05c5c", borderColor:"#e05c5c" }}>削除</button>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  app:      { fontFamily:"'Hiragino Sans','Noto Sans JP',sans-serif", background:"#f5f2ee", minHeight:"100vh", maxWidth:480, margin:"0 auto" },
  header:   { background:"#2a5a3a", padding:"12px 16px 0" },
  headerTop:{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 },
  logo:     { fontSize:"1.3rem" },
  appName:  { color:"#fff", fontSize:"1.1rem", fontWeight:700, letterSpacing:"0.05em" },
  tabs:     { display:"flex" },
  tab:      { flex:1, background:"none", border:"none", color:"rgba(255,255,255,0.6)", padding:"8px 4px", fontSize:"0.7rem", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, borderBottom:"2px solid transparent", transition:"all 0.2s" },
  tabOn:    { color:"#fff", borderBottom:"2px solid #fff", fontWeight:700 },
  tabLabel: { fontSize:"0.62rem" },
  body:     { padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 },
  card:     { background:"#fff", borderRadius:14, padding:"14px 16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column", gap:8 },
  cardLabel:{ fontSize:"0.78rem", fontWeight:700, color:"#2a5a3a", letterSpacing:"0.06em" },
  input:    { border:"1.5px solid #e8e4de", borderRadius:9, padding:"9px 12px", fontSize:"0.92rem", width:"100%", boxSizing:"border-box", fontFamily:"inherit", outline:"none" },
  btn:      { background:"#2a5a3a", color:"#fff", border:"none", borderRadius:9, padding:"11px", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", width:"100%" },
  smBtn:    { background:"#2a5a3a", color:"#fff", border:"none", borderRadius:9, padding:"9px 14px", fontSize:"0.88rem", fontWeight:700, cursor:"pointer" },
  ghostBtn: { background:"none", border:"1px solid #ddd", borderRadius:7, padding:"4px 10px", fontSize:"0.78rem", cursor:"pointer", color:"#888" },
  badge:    { background:"#eef7f2", color:"#2a5a3a", fontWeight:700, fontSize:"0.8rem", padding:"3px 8px", borderRadius:20, whiteSpace:"nowrap" },
  chip:     { background:"#f5f2ee", border:"1px solid #e0dbd4", borderRadius:20, padding:"5px 12px", fontSize:"0.82rem", cursor:"pointer", color:"#666" },
  chipOn:   { background:"#6d4c41", borderColor:"#6d4c41", color:"#fff" },
  cntBtn:   { background:"#eef7f2", border:"1px solid #c8e6d4", borderRadius:7, padding:"5px 14px", fontSize:"1rem", cursor:"pointer", color:"#2a5a3a", fontWeight:700 },
  navRow:   { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 },
  navBtn:   { background:"none", border:"1px solid #e0dbd4", borderRadius:8, padding:"4px 14px", fontSize:"1.1rem", cursor:"pointer", color:"#2a5a3a" },
  navTitle: { fontWeight:700, fontSize:"1rem", color:"#1a1a1a" },
  periodBanner: { background:"#fff0f6", borderRadius:8, padding:"6px 12px", fontSize:"0.8rem", color:"#c2185b", fontWeight:700, textAlign:"center" },
  calGrid:  { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginTop:4 },
  dowCell:  { textAlign:"center", fontSize:"0.7rem", fontWeight:700, padding:"4px 0" },
  calCell:  { borderRadius:7, padding:"3px 1px", minHeight:58, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", background:"#faf9f7", border:"1px solid transparent" },
  calSel:   { border:"2px solid #2a5a3a", background:"#eef7f2" },
  calToday: { background:"#e4f0e8" },
  legend:   { fontSize:"0.7rem", color:"#888", display:"flex", alignItems:"center", gap:2 },
};
