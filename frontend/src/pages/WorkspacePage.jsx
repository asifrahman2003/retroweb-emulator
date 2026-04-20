import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import CanvasOutput from '../components/CanvasOutput';
import DebugControls from '../components/DebugControls';
import MemoryViewer from '../components/MemoryViewer';

function configureRetroAssemblyLanguage(monaco) {
  if (!monaco || monaco.languages.getLanguages().some((l) => l.id === 'retroweb-assembly')) return;
  monaco.languages.register({ id: 'retroweb-assembly' });
  monaco.languages.setMonarchTokensProvider('retroweb-assembly', {
    tokenizer: {
      root: [
        [/;.*$/, 'comment'],
        [/\/\/.*$/, 'comment'],
        [/\b(?:LDI|ADD|SUB|STORE|LOAD|OUT|JZ|JNZ|JMP|PIX|PIXR|HLT|HALT|PRINT|DEC|INC|AND|OR|XOR|NOT|PUSH|POP|CALL|RET|CMP|MOV|NOP)\b/i, 'keyword'],
        [/\bR[0-7]\b/i, 'variable.predefined'],
        [/\b0x[0-9a-fA-F]+\b/, 'number.hex'],
        [/\b\d+\b/, 'number'],
        [/^[ \t]*[A-Za-z_][A-Za-z0-9_]*:/, 'type.identifier'],
      ],
    },
  });
  monaco.languages.setLanguageConfiguration('retroweb-assembly', { comments: { lineComment: ';' } });
}

export default function WorkspacePage({
  isAssembly,
  input,
  onAssemblyModeChange,
  onEditorChange,
  onEditorMount,
  vmInstance,
  editor,
  monaco,
  sourceMap,
  programBytes,
  vmRuntimeState,
  onExecutionChange,
  onExecuteVmAction,
  onPrepareProgram,
  programDirty,
  onRunVm,
  learningPanelProps,
  renderedOutput,
  registerValues,
  memorySnapshot,
  currentPc,
  executionVersion,
  vmStatusLabel,
  vmStatusClassName,
}) {
  const debugRef = useRef(null);
  const [activeTab, setActiveTab] = useState('console');

  const {
    examples,
    challenges,
    selectedExampleId,
    selectedChallengeId,
    savedPrograms,
    challengeProgress,
    challengeResult,
    onSelectExample,
    onLoadExample,
    onSelectChallenge,
    onLoadChallenge,
    onSelectSavedProgram,
    onLoadSavedProgram,
    onSaveProgram,
  } = learningPanelProps;

  const activeExample = examples.find((e) => e.id === selectedExampleId) ?? examples[0];
  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId) ?? challenges[0];

  const hasError = vmRuntimeState?.lastError != null && vmRuntimeState.lastError !== 0;
  const statusDot = hasError ? '#f87171' : vmRuntimeState?.halted ? '#fbbf24' : '#4ade80';
  const fileSlug = (activeExample?.title ?? 'program').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div
      className="workspace-dark rw-frame"
      style={{ display: 'flex', flexDirection: 'column', height: 'min(calc(100vh - 186px), 880px)' }}
    >
      {/* ── Toolbar ── */}
      <div
        className="rw-frame-label"
        style={{ flexShrink: 0, height: 40, padding: '0 10px', gap: 8 }}
      >
        {/* Traffic lights + file tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block', flexShrink: 0 }} />
            ))}
          </div>
          <span className="rw-chip" style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(255,255,255,0.06)', borderColor: 'var(--line)' }}>
            {fileSlug}.asm ●
          </span>
        </div>

        {/* Mode toggle */}
        <div className="rw-segment" style={{ margin: '0 auto', flexShrink: 0 }}>
          <button type="button" className={isAssembly ? 'on' : ''} onClick={() => { if (!isAssembly) onAssemblyModeChange(); }}>
            Assembly
          </button>
          <button type="button" className={!isAssembly ? 'on' : ''} onClick={() => { if (isAssembly) onAssemblyModeChange(); }}>
            Bytes
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onRunVm}
            style={{ background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff', padding: '4px 12px', fontSize: 11, fontWeight: 600 }}
          >
            ▶ Run
          </button>
          {vmInstance && editor && monaco && (
            <>
              <button
                type="button"
                onClick={() => debugRef.current?.step()}
                style={{ background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink)', padding: '4px 10px', fontSize: 11 }}
              >
                Step
              </button>
              <button
                type="button"
                onClick={() => debugRef.current?.reset()}
                style={{ background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink-3)', padding: '4px 10px', fontSize: 11 }}
              >
                ↺ Reset
              </button>
            </>
          )}
          <span className="rw-chip" style={{ gap: 5, borderColor: 'var(--line)', background: 'transparent', fontSize: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: 'var(--ink-3)' }}>{vmStatusLabel}</span>
          </span>
        </div>
      </div>

      {/* ── 3-column body ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '196px minmax(0, 1fr) 228px', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* ── Left drawer ── */}
        <div style={{ background: 'var(--panel-soft)', borderRight: '1px solid var(--line)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <SectionLabel label="LESSON" />
          <div style={{ padding: '10px 12px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>{activeExample.title}</div>
            <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.55 }}>{activeExample.description}</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {activeExample.concepts?.map((c) => (
                <span key={c} className="rw-chip rw-chip-accent" style={{ fontSize: 10, padding: '2px 6px' }}>{c}</span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onLoadExample(activeExample)}
              style={{ marginTop: 8, width: '100%', background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff', padding: '5px 0', fontSize: 11 }}
            >
              Load example
            </button>
          </div>

          <div style={{ padding: '0 12px 10px', borderBottom: '1px solid var(--line)', marginTop: 10 }}>
            <div className="rw-eyebrow" style={{ color: 'var(--ink-3)', fontSize: 10, paddingBottom: 5 }}>ALL LESSONS</div>
            <select
              value={activeExample.id}
              onChange={(e) => onSelectExample(e.target.value)}
              style={{ width: '100%', background: 'var(--panel)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 5, padding: '5px 8px', fontSize: 11, outline: 'none' }}
            >
              {examples.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 5px' }}>
              <span className="rw-eyebrow" style={{ color: 'var(--ink-3)', fontSize: 10 }}>SAVED</span>
              <button
                type="button"
                onClick={onSaveProgram}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: 11, padding: '0 2px', cursor: 'pointer' }}
              >
                + save
              </button>
            </div>
            {savedPrograms.length > 0 ? (
              <div style={{ padding: '0 8px 8px' }}>
                {savedPrograms.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { onSelectSavedProgram(p.id); onLoadSavedProgram(p.id); }}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 6, padding: '4px 6px', background: 'transparent', border: 'none', color: 'var(--ink)', fontSize: 11, cursor: 'pointer', borderRadius: 4, textAlign: 'left' }}
                  >
                    <span style={{ color: 'var(--ink-3)', fontSize: 10, flexShrink: 0 }}>○</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ padding: '4px 12px 10px', fontSize: 11, color: 'var(--ink-3)', opacity: 0.7 }}>No saved programs yet.</div>
            )}
          </div>
        </div>

        {/* ── Center: editor + console ── */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--panel)', overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              beforeMount={configureRetroAssemblyLanguage}
              language={isAssembly ? 'retroweb-assembly' : 'plaintext'}
              value={input}
              onChange={onEditorChange}
              onMount={onEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Console panel */}
          <div style={{ height: 172, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ height: 30, display: 'flex', alignItems: 'center', paddingLeft: 4, paddingRight: 10, borderBottom: '1px solid var(--line)', background: 'var(--panel-soft)', flexShrink: 0 }}>
              {['Console', 'Tests'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  style={{ background: activeTab === tab.toLowerCase() ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === tab.toLowerCase() ? 'var(--ink)' : 'var(--ink-3)', border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {tab}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: statusDot, fontFamily: '"JetBrains Mono", monospace' }}>● {vmStatusLabel}</span>
            </div>
            {activeTab === 'console' && (
              <pre style={{ flex: 1, margin: 0, padding: '8px 12px', overflowY: 'auto', fontSize: 11, lineHeight: 1.65, fontFamily: '"JetBrains Mono", monospace', color: 'var(--ink-2)', background: 'var(--output-bg)' }}>
                {renderedOutput || '—'}
              </pre>
            )}
            {activeTab === 'tests' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', background: 'var(--output-bg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: '"JetBrains Mono", monospace' }}>{activeChallenge?.title}</span>
                  <button type="button" onClick={() => onLoadChallenge(activeChallenge)} style={{ fontSize: 10, padding: '3px 8px', color: 'var(--accent)', border: '1px solid rgba(217,106,44,0.4)', background: 'transparent', borderRadius: 4 }}>Load starter</button>
                </div>
                <select
                  value={activeChallenge?.id}
                  onChange={(e) => onSelectChallenge(e.target.value)}
                  style={{ background: 'var(--panel-soft)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 4, padding: '4px 8px', fontSize: 11, outline: 'none' }}
                >
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}{challengeProgress?.[c.id]?.passed ? ' ✓' : ''}</option>
                  ))}
                </select>
                <p style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5, margin: 0 }}>{activeChallenge?.prompt}</p>
                {challengeResult && (
                  <div style={{ padding: '5px 9px', borderRadius: 4, background: challengeResult.passed ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${challengeResult.passed ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`, fontSize: 11, color: challengeResult.passed ? '#4ade80' : '#f87171' }}>
                    {challengeResult.passed ? '✓ Passed' : '✗ Not yet'}
                    {challengeResult.summary && <span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>{challengeResult.summary}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: state panels ── */}
        <div style={{ background: 'var(--panel-soft)', borderLeft: '1px solid var(--line)', overflowY: 'auto' }}>
          {/* Registers */}
          <SectionLabel label="REGISTERS" right="hex" />
          <div style={{ padding: '8px 12px', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
            {(registerValues ?? []).map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2.5px 0' }}>
                <span style={{ color: 'var(--ink-3)' }}>R{i}</span>
                <span style={{ color: v !== 0 ? 'var(--accent)' : 'var(--ink)' }}>
                  {`0x${v.toString(16).padStart(2, '0').toUpperCase()}`}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--line)', marginTop: 5, paddingTop: 5, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ink-3)' }}>PC</span>
              <span style={{ color: 'var(--accent)' }}>{`0x${currentPc.toString(16).padStart(4, '0').toUpperCase()}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ color: 'var(--ink-3)' }}>FLAGS</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 10 }}>{vmRuntimeState?.halted ? 'HLT' : hasError ? 'ERR' : '—'}</span>
            </div>
          </div>

          {/* Memory */}
          <SectionLabel label="MEMORY" right="0x0000" topBorder />
          <div style={{ padding: '8px', fontFamily: '"JetBrains Mono", monospace' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, marginBottom: 3 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 9, color: 'var(--ink-3)', opacity: 0.55 }}>
                  {i.toString(16).toUpperCase().padStart(2, '0')}
                </div>
              ))}
            </div>
            {Array.from({ length: 5 }, (_, r) => (
              <div key={r} style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, marginBottom: 2 }}>
                {Array.from(memorySnapshot.slice(r * 8, r * 8 + 8)).map((b, i) => {
                  const addr = r * 8 + i;
                  const isPC = addr === currentPc;
                  return (
                    <div
                      key={i}
                      title={`0x${addr.toString(16).toUpperCase()}: ${b}`}
                      style={{ textAlign: 'center', fontSize: 9, padding: '2px 0', borderRadius: 2, background: isPC ? 'var(--accent)' : b !== 0 ? 'rgba(217,106,44,0.15)' : 'rgba(255,255,255,0.04)', color: isPC ? '#000' : b !== 0 ? 'var(--accent)' : 'var(--ink-3)' }}
                    >
                      {b.toString(16).padStart(2, '0').toUpperCase()}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Framebuffer */}
          <SectionLabel label="FRAMEBUFFER · 16×10" topBorder />
          <div style={{ padding: 8 }}>
            {vmInstance ? (
              <CanvasOutput memorySnapshot={memorySnapshot} drawTrigger={executionVersion} compact />
            ) : (
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>VM loading…</span>
            )}
          </div>
        </div>
      </div>

      {/* Headless DebugControls — manages editor highlighting, exposes step/reset via ref */}
      {vmInstance && editor && monaco && (
        <DebugControls
          ref={debugRef}
          headless
          vmInstance={vmInstance}
          editor={editor}
          monaco={monaco}
          sourceMap={sourceMap}
          programBytes={programBytes}
          vmRuntimeState={vmRuntimeState}
          onExecutionChange={onExecutionChange}
          onExecuteVmAction={onExecuteVmAction}
          onPrepareProgram={onPrepareProgram}
          programDirty={programDirty}
        />
      )}
    </div>
  );
}

function SectionLabel({ label, right, topBorder }) {
  return (
    <div
      className="rw-frame-label"
      style={{
        borderTop: topBorder ? '1px solid var(--line)' : undefined,
        borderRadius: 0,
        padding: '7px 12px',
      }}
    >
      <span className="rw-eyebrow" style={{ color: 'var(--ink-3)', fontSize: 10 }}>{label}</span>
      {right && <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: '"JetBrains Mono", monospace' }}>{right}</span>}
    </div>
  );
}
