import { useEffect, useMemo, useState, type ReactNode } from "react";

type Screen =
  | "home"
  | "new"
  | "processing"
  | "dashboard"
  | "heatmap"
  | "feedback"
  | "history"
  | "about";

type IconName =
  | "home"
  | "plus"
  | "history"
  | "info"
  | "mic"
  | "upload"
  | "arrow"
  | "check"
  | "clock"
  | "file"
  | "play"
  | "pause"
  | "stop"
  | "search"
  | "chevron"
  | "wave"
  | "spark"
  | "menu"
  | "close"
  | "download";

const navItems: { id: Screen; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "new", label: "New Analysis", icon: "plus" },
  { id: "history", label: "Previous Results", icon: "history" },
  { id: "about", label: "About", icon: "info" },
];

const pageMeta: Record<Screen, { eyebrow: string; title: string; subtitle: string }> = {
  home: {
    eyebrow: "Speech coaching, made measurable",
    title: "Speak with clarity.\nPresent with confidence.",
    subtitle:
      "Get clear, actionable feedback on your English speech delivery for presentations, research defenses, and interviews.",
  },
  new: {
    eyebrow: "New session",
    title: "New Speech Analysis",
    subtitle: "Record directly or upload an audio file to begin your analysis.",
  },
  processing: {
    eyebrow: "Analysis in progress",
    title: "Analyzing Your Speech",
    subtitle: "We’re examining measurable characteristics of your recording.",
  },
  dashboard: {
    eyebrow: "Academic Presentation · May 18, 2025",
    title: "Speech Analysis",
    subtitle: "A detailed overview of your 4 minute, 12 second recording.",
  },
  heatmap: {
    eyebrow: "Delivery patterns",
    title: "Vocal Delivery Heatmap",
    subtitle: "See where delivery changes occurred throughout your recording.",
  },
  feedback: {
    eyebrow: "Personalized coaching",
    title: "Speech Feedback",
    subtitle: "Practical recommendations based on your delivery analysis.",
  },
  history: {
    eyebrow: "Your practice",
    title: "Previous Results",
    subtitle: "Review your past sessions and track your delivery over time.",
  },
  about: {
    eyebrow: "About Alon",
    title: "Speech practice,\ngrounded in measurement.",
    subtitle: "A focused coaching tool created for students and academic speakers.",
  },
};

const metrics = [
  { label: "Speech Rate", value: "142", unit: "wpm", status: "Good pace", tone: "blue" },
  { label: "Pause Duration", value: "0.8", unit: "sec avg", status: "Natural", tone: "teal" },
  { label: "Pitch Variation", value: "32", unit: "Hz range", status: "Balanced", tone: "violet" },
  { label: "Jitter", value: "0.9", unit: "%", status: "Consistent", tone: "sky" },
  { label: "Shimmer", value: "3.2", unit: "%", status: "Steady", tone: "cyan" },
  { label: "Filler Words", value: "7", unit: "total", status: "Review", tone: "amber" },
  { label: "Verbal Crutches", value: "3", unit: "total", status: "Review", tone: "rose" },
];

const processingSteps = [
  "Preparing Audio",
  "Generating Transcript",
  "Analyzing Speech Rate",
  "Detecting Pauses",
  "Analyzing Pitch",
  "Measuring Jitter and Shimmer",
  "Detecting Filler Words",
  "Detecting Verbal Crutches",
  "Generating Results",
];

const issues = [
  {
    time: "00:32",
    seconds: 32,
    segment: "“Um, our study focuses on...”",
    issue: "Filler word",
    measure: "“um”",
    feedback: "Try using a short pause instead of a filler word.",
    color: "amber",
  },
  {
    time: "01:08",
    seconds: 68,
    segment: "“The results clearly indicate a...”",
    issue: "Fast speech",
    measure: "178 wpm",
    feedback: "Slow down slightly to give this finding more emphasis.",
    color: "blue",
  },
  {
    time: "01:47",
    seconds: 107,
    segment: "“As you can see on this chart...”",
    issue: "Long pause",
    measure: "2.8 sec",
    feedback: "Plan the transition to keep the explanation flowing.",
    color: "violet",
  },
  {
    time: "02:21",
    seconds: 141,
    segment: "“Basically, these three groups...”",
    issue: "Verbal crutch",
    measure: "“basically”",
    feedback: "Begin directly with the key point for a stronger statement.",
    color: "rose",
  },
  {
    time: "03:06",
    seconds: 186,
    segment: "“Our second observation was...”",
    issue: "Pitch change",
    measure: "+24 Hz",
    feedback: "The variation adds useful emphasis to this transition.",
    color: "teal",
  },
  {
    time: "03:39",
    seconds: 219,
    segment: "“Uh, to conclude this section...”",
    issue: "Filler word",
    measure: "“uh”",
    feedback: "Pause briefly before introducing your conclusion.",
    color: "amber",
  },
];

const recommendations = [
  {
    title: "Speech Rate",
    icon: "wave" as IconName,
    summary: "Your overall pace was clear and easy to follow.",
    detail: "You averaged 142 words per minute. One section at 01:08 reached 178 wpm; slow slightly when explaining key findings.",
    tone: "blue",
  },
  {
    title: "Pauses",
    icon: "pause" as IconName,
    summary: "Most pauses supported your phrasing naturally.",
    detail: "Your average pause was 0.8 seconds. Prepare the transition around 01:47 to avoid the longer 2.8-second break.",
    tone: "violet",
  },
  {
    title: "Filler Words",
    icon: "mic" as IconName,
    summary: "Seven filler words appeared in this recording.",
    detail: "Try replacing words such as “um” and “uh” with short silent pauses. Focus first on transitions between sections.",
    tone: "amber",
  },
  {
    title: "Verbal Crutches",
    icon: "spark" as IconName,
    summary: "Three repeated phrases softened key statements.",
    detail: "Remove “basically” when the sentence remains clear without it. Starting directly will make your claims more precise.",
    tone: "rose",
  },
  {
    title: "Pitch",
    icon: "wave" as IconName,
    summary: "Your pitch variation added appropriate emphasis.",
    detail: "The 32 Hz range kept your delivery engaged. Continue varying pitch around key terms and section transitions.",
    tone: "teal",
  },
  {
    title: "Vocal Stability",
    icon: "check" as IconName,
    summary: "Your voice remained steady across the recording.",
    detail: "Jitter and shimmer measurements were consistent. Maintain this delivery by taking a calm breath before each section.",
    tone: "sky",
  },
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    mic: <><rect x="8" y="3" width="8" height="12" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M6 3h8l4 4v14H6zM14 3v5h4" /><path d="M9 13h6M9 17h6" /></>,
    play: <><path d="m8 5 11 7-11 7z" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    stop: <><rect x="6" y="6" width="12" height="12" rx="1" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    wave: <><path d="M3 12h2l2-7 4 14 3-10 3 6h4" /></>,
    spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z" /><path d="m18 15 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7z" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className="logo-text">Alon</span>
    </div>
  );
}

function PageHeader({ screen }: { screen: Screen }) {
  const meta = pageMeta[screen];
  return (
    <div className={`page-header ${screen === "home" || screen === "about" ? "page-header-large" : ""}`}>
      <div className="eyebrow">{meta.eyebrow}</div>
      <div className="page-title" role="heading" aria-level={1}>
        {meta.title.split("\n").map((line) => <span key={line}>{line}</span>)}
      </div>
      <div className="page-subtitle">{meta.subtitle}</div>
    </div>
  );
}

function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  setMobileOpen,
}: {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <div className="nav-label">Workspace</div>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`nav-item ${active === item.id ? "nav-item-active" : ""}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="note-icon"><Icon name="spark" size={18} /></div>
          <div>
            <strong>Practice with purpose</strong>
            <span>Small improvements create confident speakers.</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="avatar">AM</div>
          <div className="profile-copy">
            <strong>Alex Morgan</strong>
            <span>Student account</span>
          </div>
          <Icon name="chevron" size={16} />
        </div>
      </aside>
    </>
  );
}

function Home({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="home-layout">
      <section className="hero">
        <PageHeader screen="home" />
        <div className="hero-actions">
          <Button icon="mic" onClick={() => navigate("new")}>Record Speech</Button>
          <Button icon="upload" variant="secondary" onClick={() => navigate("new")}>Upload Audio</Button>
        </div>
        <div className="trust-row">
          {["Measurable feedback", "Private by design", "Made for students"].map((item) => (
            <span key={item}><Icon name="check" size={14} />{item}</span>
          ))}
        </div>
      </section>
      <section className="hero-visual" aria-label="Example speech analysis">
        <div className="visual-glow" />
        <div className="demo-card">
          <div className="demo-head">
            <div>
              <span className="mini-label">DELIVERY OVERVIEW</span>
              <strong>Academic presentation</strong>
            </div>
            <span className="status-pill"><i /> Analysis complete</span>
          </div>
          <div className="workstation-meta">
            <span>04:12 recording</span>
            <span>142 wpm average</span>
            <span>32 Hz pitch range</span>
          </div>
          <div className="waveform-shell">
            <div className="waveform-ruler"><span>00:00</span><span>01:03</span><span>02:06</span><span>03:09</span><span>04:12</span></div>
            <div className="sound-wave">
            {[13,22,17,31,48,26,19,37,61,42,28,53,71,46,32,59,79,64,38,23,44,68,51,29,18,39,57,74,43,26,49,66,35,21,47,73,55,33,16,41,62,81,58,37,24,52,69,45,30,17,36,56,76,48,27,43,63,34,20,46,70,51,25,14,32,54,39,19,28,17,11,24].map((height, i) => (
              <span
                key={i}
                className={i >= 17 && i <= 23 ? "wave-good" : i >= 42 && i <= 49 ? "wave-review" : ""}
                style={{ height: `${height}%` }}
              />
            ))}
            </div>
            <div className="playhead"><i /><span>02:06</span></div>
          </div>
          <div className="timeline-insights">
            <div className="insight-marker insight-good">
              <span>01:08</span>
              <strong>Clear emphasis</strong>
            </div>
            <div className="insight-marker insight-review">
              <span>03:06</span>
              <strong>Slow slightly</strong>
            </div>
          </div>
          <div className="waveform-legend">
            <span><i className="legend-normal" />Normal pace</span>
            <span><i className="legend-good" />Clear emphasis</span>
            <span><i className="legend-review" />Review</span>
          </div>
        </div>
      </section>
      <section className="purpose-strip">
        <div>
          <span className="mini-label">BUILT FOR YOUR NEXT</span>
          <strong>Academic presentation</strong>
        </div>
        <div><strong>Research defense</strong></div>
        <div><strong>Mock job interview</strong></div>
      </section>
    </div>
  );
}

function NewAnalysis({ navigate }: { navigate: (screen: Screen) => void }) {
  const [mode, setMode] = useState<"record" | "upload">("record");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [speechType, setSpeechType] = useState("Academic Presentation");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  const displayTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <PageHeader screen="new" />
      <div className="segmented-control">
        <button className={mode === "record" ? "active" : ""} onClick={() => setMode("record")}><Icon name="mic" size={17} />Record speech</button>
        <button className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")}><Icon name="upload" size={17} />Upload audio</button>
      </div>
      <div className="new-grid">
        <section className="record-card">
          {mode === "record" ? (
            <>
              <div className={`mic-orb ${recording ? "mic-orb-active" : ""}`}><Icon name="mic" size={38} /></div>
              <div className="recording-state">{recording ? "Recording in progress" : seconds ? "Recording paused" : "Ready to record"}</div>
              <div className="timer">{displayTime}</div>
              <div className="level-bars" aria-hidden="true">
                {[4, 10, 16, 8, 22, 14, 28, 18, 11, 24, 16, 6, 19, 12, 4].map((height, i) => <span key={i} style={{ height: recording ? height : 4 }} />)}
              </div>
              <div className="record-controls">
                <Button icon={recording ? "pause" : "mic"} onClick={() => setRecording(!recording)}>{recording ? "Pause" : seconds ? "Resume" : "Start Recording"}</Button>
                <Button icon="stop" variant="secondary" disabled={!seconds} onClick={() => setRecording(false)}>Stop</Button>
              </div>
              <p className="helper-text">Allow microphone access when prompted. Find a quiet space for the clearest analysis.</p>
            </>
          ) : (
            <label className={`drop-zone ${fileName ? "drop-zone-ready" : ""}`}>
              <input type="file" accept=".mp3,.wav,.m4a,.aac" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
              <div className="drop-icon"><Icon name={fileName ? "check" : "upload"} size={28} /></div>
              <div className="drop-title">{fileName || "Drop your audio file here"}</div>
              <div className="drop-copy">{fileName ? "Ready to analyze" : "or click to browse your computer"}</div>
              {!fileName && <span className="browse-button">Choose file</span>}
              <div className="file-meta">MP3, WAV, M4A or AAC · Maximum 100 MB</div>
            </label>
          )}
        </section>
        <aside className="setup-card">
          <div className="section-title">Session details</div>
          <div className="section-copy">Help Alon tailor feedback to your speaking context.</div>
          <label className="field-label" htmlFor="speech-type">Speech type</label>
          <div className="select-wrap">
            <select id="speech-type" value={speechType} onChange={(event) => setSpeechType(event.target.value)}>
              <option>Academic Presentation</option>
              <option>Research Defense</option>
              <option>Mock Job Interview</option>
            </select>
            <Icon name="chevron" size={16} />
          </div>
          <div className="analysis-includes">
            <span>Analysis includes</span>
            {["Speech rate and pauses", "Pitch and vocal stability", "Filler words and verbal crutches", "Timestamped feedback"].map((item) => (
              <div key={item}><i><Icon name="check" size={12} /></i>{item}</div>
            ))}
          </div>
          <Button icon="spark" className="full-button" onClick={() => navigate("processing")}>Analyze Speech</Button>
          <div className="privacy-line"><Icon name="check" size={13} /> Your audio is handled securely.</div>
        </aside>
      </div>
    </>
  );
}

function Processing({ navigate }: { navigate: (screen: Screen) => void }) {
  const [progress, setProgress] = useState(18);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => navigate("dashboard"), 600);
          return 100;
        }
        return Math.min(100, value + 2);
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [navigate]);
  const activeStep = Math.min(processingSteps.length - 1, Math.floor((progress / 100) * processingSteps.length));
  return (
    <div className="processing-page">
      <PageHeader screen="processing" />
      <div className="processing-card">
        <div className="processing-orbit">
          <div className="orbit-ring" />
          <div className="orbit-core"><Icon name="wave" size={32} /></div>
        </div>
        <div className="progress-copy">
          <strong>{progress}% complete</strong>
          <span>{processingSteps[activeStep]}</span>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="steps-grid">
          {processingSteps.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <div className={`process-step ${done ? "done" : ""} ${active ? "active" : ""}`} key={step}>
                <i>{done ? <Icon name="check" size={12} /> : index + 1}</i><span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="processing-note">Please keep this window open. Your results will appear automatically when the analysis is complete.</p>
    </div>
  );
}

function AudioPlayer({ current = "01:24" }: { current?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="audio-player">
      <button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause recording" : "Play recording"}>
        <Icon name={playing ? "pause" : "play"} size={19} />
      </button>
      <span className="audio-time">{current}</span>
      <div className="audio-track"><span style={{ width: "33%" }} /><i style={{ left: "33%" }} /></div>
      <span className="audio-time">04:12</span>
      <button className="audio-action" aria-label="Download recording"><Icon name="download" size={18} /></button>
    </div>
  );
}

function Dashboard({ navigate }: { navigate: (screen: Screen) => void }) {
  const [tab, setTab] = useState<"full" | "timestamped">("timestamped");
  return (
    <>
      <div className="header-row">
        <PageHeader screen="dashboard" />
        <div className="header-actions">
          <Button variant="secondary" onClick={() => navigate("heatmap")}>View Heatmap</Button>
          <Button onClick={() => navigate("feedback")}>View Feedback <Icon name="arrow" size={17} /></Button>
        </div>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <div className="metric-top"><span>{metric.label}</span><i className={`metric-dot tone-${metric.tone}`} /></div>
            <div className="metric-value">{metric.value}<small>{metric.unit}</small></div>
            <div className={`metric-status tone-text-${metric.tone}`}><Icon name={metric.status === "Review" ? "info" : "check"} size={13} />{metric.status}</div>
          </div>
        ))}
      </div>
      <section className="content-card player-card">
        <div className="card-heading"><div><strong>Recording</strong><span>Academic Presentation · 4:12</span></div><span className="status-pill"><i /> Analysis complete</span></div>
        <AudioPlayer />
      </section>
      <section className="content-card transcript-card">
        <div className="card-heading transcript-heading">
          <div><strong>Transcript</strong><span>Click any timestamp to jump to that moment.</span></div>
          <div className="mini-tabs">
            <button className={tab === "full" ? "active" : ""} onClick={() => setTab("full")}>Full text</button>
            <button className={tab === "timestamped" ? "active" : ""} onClick={() => setTab("timestamped")}>Timestamped</button>
          </div>
        </div>
        {tab === "timestamped" ? (
          <div className="transcript-lines">
            <div><button>00:00</button><p>Good afternoon. Today I’ll be presenting the findings from our recent study on collaborative learning in online environments.</p></div>
            <div><button>00:32</button><p><mark className="filler">Um</mark>, our study focuses on how students build shared understanding when working remotely across different time zones.</p></div>
            <div><button>01:08</button><p>The results clearly indicate a meaningful improvement in both participation and the quality of peer feedback across all three groups.</p></div>
            <div><button>01:47</button><p>As you can see on this chart, engagement increased most significantly during the structured discussion activities.</p></div>
            <div><button>02:21</button><p><mark className="crutch">Basically</mark>, these three groups followed the same learning framework, with minor variations in group size.</p></div>
            <div><button>03:39</button><p><mark className="filler">Uh</mark>, to conclude this section, the evidence supports a more intentional approach to online collaborative learning.</p></div>
          </div>
        ) : (
          <p className="full-transcript">Good afternoon. Today I’ll be presenting the findings from our recent study on collaborative learning in online environments. <mark className="filler">Um</mark>, our study focuses on how students build shared understanding when working remotely across different time zones. The results clearly indicate a meaningful improvement in both participation and the quality of peer feedback across all three groups. As you can see on this chart, engagement increased most significantly during the structured discussion activities. <mark className="crutch">Basically</mark>, these three groups followed the same learning framework, with minor variations in group size.</p>
        )}
        <div className="transcript-legend"><span><i className="legend-filler" />Filler word</span><span><i className="legend-crutch" />Verbal crutch</span></div>
      </section>
    </>
  );
}

function Heatmap({ navigate }: { navigate: (screen: Screen) => void }) {
  const [selected, setSelected] = useState(issues[1]);
  return (
    <>
      <div className="header-row">
        <PageHeader screen="heatmap" />
        <Button onClick={() => navigate("feedback")}>View Feedback <Icon name="arrow" size={17} /></Button>
      </div>
      <section className="content-card heatmap-card">
        <div className="card-heading"><div><strong>Recording timeline</strong><span>Select a marker to review the detected moment.</span></div><span className="duration-chip"><Icon name="clock" size={15} /> 04:12</span></div>
        <AudioPlayer current={selected.time} />
        <div className="timeline-wrap">
          <div className="timeline-base">
            <div className="timeline-fill" />
            {issues.map((issue) => (
              <button
                key={issue.time}
                className={`timeline-marker marker-${issue.color} ${selected.time === issue.time ? "selected" : ""}`}
                style={{ left: `${(issue.seconds / 252) * 100}%` }}
                onClick={() => setSelected(issue)}
                aria-label={`${issue.issue} at ${issue.time}`}
              >
                <i /><span>{issue.time}</span>
              </button>
            ))}
          </div>
          <div className="timeline-labels"><span>00:00</span><span>01:03</span><span>02:06</span><span>03:09</span><span>04:12</span></div>
        </div>
        <div className="heatmap-legend">
          {[["blue","Fast speech"],["sky","Slow speech"],["violet","Long pause"],["amber","Filler word"],["rose","Verbal crutch"],["teal","Pitch change"],["slate","Vocal instability"]].map(([color,label]) => <span key={label}><i className={`marker-bg-${color}`} />{label}</span>)}
        </div>
        <div className="selected-insight">
          <span className={`selected-icon marker-bg-${selected.color}`}><Icon name="wave" size={18} /></span>
          <div><span>{selected.time} · {selected.issue}</span><strong>{selected.segment}</strong><p>{selected.feedback}</p></div>
        </div>
      </section>
      <section className="content-card issues-card">
        <div className="card-heading"><div><strong>Detected moments</strong><span>{issues.length} moments worth reviewing</span></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Timestamp</th><th>Speech segment</th><th>Detected issue</th><th>Measurement</th><th>Feedback</th></tr></thead>
            <tbody>{issues.map((issue) => (
              <tr key={issue.time} onClick={() => setSelected(issue)} className={selected.time === issue.time ? "selected-row" : ""}>
                <td><button className="time-link">{issue.time}</button></td>
                <td>{issue.segment}</td>
                <td><span className={`issue-pill issue-${issue.color}`}><i />{issue.issue}</span></td>
                <td>{issue.measure}</td>
                <td>{issue.feedback}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Feedback({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <>
      <div className="header-row">
        <PageHeader screen="feedback" />
        <Button variant="secondary" icon="download">Export summary</Button>
      </div>
      <section className="summary-banner">
        <div className="summary-score"><div><strong>84</strong><span>/ 100</span></div><small>Delivery score</small></div>
        <div className="summary-copy">
          <span className="mini-label">OVERALL SUMMARY</span>
          <strong>Your delivery was clear, measured, and easy to follow.</strong>
          <p>Your pace and vocal stability were consistent throughout most of the presentation. For your next session, focus on replacing filler words with intentional pauses and slowing slightly when introducing key findings.</p>
        </div>
      </section>
      <div className="recommendation-grid">
        {recommendations.map((recommendation) => (
          <article className="recommendation-card" key={recommendation.title}>
            <div className={`recommendation-icon tone-bg-${recommendation.tone}`}><Icon name={recommendation.icon} size={21} /></div>
            <div><span>{recommendation.title}</span><strong>{recommendation.summary}</strong><p>{recommendation.detail}</p></div>
          </article>
        ))}
      </div>
      <div className="feedback-actions">
        <Button variant="secondary" icon="play" onClick={() => navigate("dashboard")}>Review Recording</Button>
        <Button variant="secondary" icon="wave" onClick={() => navigate("heatmap")}>View Heatmap</Button>
        <Button icon="plus" onClick={() => navigate("new")}>Start New Analysis</Button>
      </div>
    </>
  );
}

const sessions = [
  { date: "May 18, 2025", type: "Academic Presentation", duration: "04:12", rate: "142 wpm", fillers: 7, score: 84 },
  { date: "May 12, 2025", type: "Research Defense", duration: "08:36", rate: "151 wpm", fillers: 11, score: 78 },
  { date: "May 4, 2025", type: "Mock Job Interview", duration: "06:08", rate: "136 wpm", fillers: 5, score: 88 },
  { date: "Apr 26, 2025", type: "Academic Presentation", duration: "03:47", rate: "159 wpm", fillers: 9, score: 75 },
  { date: "Apr 15, 2025", type: "Research Defense", duration: "09:21", rate: "145 wpm", fillers: 13, score: 72 },
];

function History({ navigate }: { navigate: (screen: Screen) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All speech types");
  const filtered = useMemo(() => sessions.filter((session) =>
    (filter === "All speech types" || session.type === filter) &&
    session.type.toLowerCase().includes(query.toLowerCase())
  ), [filter, query]);
  return (
    <>
      <div className="header-row">
        <PageHeader screen="history" />
        <Button icon="plus" onClick={() => navigate("new")}>New Analysis</Button>
      </div>
      <div className="history-stats">
        <div><span>Sessions completed</span><strong>12</strong><small>Last 90 days</small></div>
        <div><span>Average speech rate</span><strong>145 <i>wpm</i></strong><small>Within target range</small></div>
        <div><span>Filler word change</span><strong className="positive">−38%</strong><small>Since your first session</small></div>
      </div>
      <section className="content-card history-card">
        <div className="history-tools">
          <div className="search-field"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sessions" /></div>
          <div className="select-wrap history-select">
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option>All speech types</option><option>Academic Presentation</option><option>Research Defense</option><option>Mock Job Interview</option>
            </select><Icon name="chevron" size={16} />
          </div>
        </div>
        <div className="session-list">
          <div className="session-row session-head"><span>Date</span><span>Speech type</span><span>Duration</span><span>Speech rate</span><span>Filler words</span><span>Score</span><span /></div>
          {filtered.map((session) => (
            <div className="session-row" key={session.date}>
              <span className="mobile-row-label">Date</span><strong>{session.date}</strong>
              <span className="session-type"><i><Icon name="file" size={16} /></i>{session.type}</span>
              <span><Icon name="clock" size={15} />{session.duration}</span>
              <span>{session.rate}</span>
              <span>{session.fillers}</span>
              <span><b className={session.score >= 80 ? "score-good" : "score-fair"}>{session.score}</b></span>
              <Button variant="ghost" onClick={() => navigate("dashboard")}>Open <Icon name="chevron" size={14} /></Button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function About({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="about-page">
      <section className="about-hero">
        <PageHeader screen="about" />
        <Button icon="mic" onClick={() => navigate("new")}>Start practicing</Button>
      </section>
      <section className="about-main">
        <div className="about-statement">
          <span className="mini-label">WHAT ALON DOES</span>
          <p>Alon is a speech coaching application designed to analyze measurable characteristics of English speech. It provides feedback based on speech rate, pauses, pitch variation, jitter, shimmer, filler words, and verbal crutches.</p>
        </div>
        <div className="principles-grid">
          <div><i><Icon name="wave" /></i><strong>Measure delivery</strong><p>Turn audio into clear, understandable speech metrics.</p></div>
          <div><i><Icon name="spark" /></i><strong>Practice intentionally</strong><p>Use timestamped coaching to focus each practice session.</p></div>
          <div><i><Icon name="history" /></i><strong>Track progress</strong><p>Compare sessions and see how your delivery changes over time.</p></div>
        </div>
        <div className="notice-card">
          <i><Icon name="info" size={22} /></i>
          <div><strong>Important notice</strong><p>Alon does not diagnose anxiety, stress disorders, or other medical or psychological conditions. Results are intended only for speech practice and delivery improvement.</p></div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app-shell">
      <Sidebar active={screen} onNavigate={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="main-content">
        <header className="mobile-header">
          <Logo />
          <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        </header>
        <div className={`content-wrap screen-${screen}`}>
          {screen === "home" && <Home navigate={navigate} />}
          {screen === "new" && <NewAnalysis navigate={navigate} />}
          {screen === "processing" && <Processing navigate={navigate} />}
          {screen === "dashboard" && <Dashboard navigate={navigate} />}
          {screen === "heatmap" && <Heatmap navigate={navigate} />}
          {screen === "feedback" && <Feedback navigate={navigate} />}
          {screen === "history" && <History navigate={navigate} />}
          {screen === "about" && <About navigate={navigate} />}
        </div>
      </main>
    </div>
  );
}
