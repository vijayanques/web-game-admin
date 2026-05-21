'use client';

import { Plus, Trash2, Gamepad2, ListOrdered, Lightbulb, Sparkles, Keyboard, Tag, Info } from 'lucide-react';
import {
  GameDetailContent,
  HowToPlayStep,
  GameModeItem,
  GameTagItem,
  GameControlItem,
} from '@/types/gameDetailContent';

interface GameDetailContentFormProps {
  value: GameDetailContent;
  onChange: (value: GameDetailContent) => void;
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

export default function GameDetailContentForm({ value, onChange }: GameDetailContentFormProps) {
  const patch = (partial: Partial<GameDetailContent>) => onChange({ ...value, ...partial });

  const updateHowToPlay = (index: number, field: keyof HowToPlayStep, text: string) => {
    const next = [...value.howToPlay];
    next[index] = { ...next[index], [field]: text };
    patch({ howToPlay: next });
  };

  const updateGameMode = (index: number, field: keyof GameModeItem, text: string) => {
    const next = [...value.gameModes];
    next[index] = { ...next[index], [field]: text };
    patch({ gameModes: next });
  };

  const updateTag = (index: number, field: keyof GameTagItem, val: string | number) => {
    const next = [...value.tags];
    next[index] = { ...next[index], [field]: val };
    patch({ tags: next });
  };

  const updateControl = (index: number, field: keyof GameControlItem, text: string) => {
    const next = [...value.controls];
    next[index] = { ...next[index], [field]: text };
    patch({ controls: next });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 font-[nunito]">
        Matches the public game detail page: Overview, Gameplay, Tags, and metadata grid.
      </p>

      <Section title="Page metadata" icon={Info}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Developer</label>
            <input
              className={inputClass}
              placeholder="e.g. Unknown Developer"
              value={value.developer}
              onChange={(e) => patch({ developer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Technology</label>
            <input
              className={inputClass}
              placeholder="HTML5"
              value={value.technology}
              onChange={(e) => patch({ technology: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Wiki page label (optional)</label>
            <input
              className={inputClass}
              placeholder="Official wiki"
              value={value.wiki}
              onChange={(e) => patch({ wiki: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Platforms (one per line)</label>
            <textarea
              className={`${inputClass} resize-y min-h-[72px]`}
              value={value.platforms.join('\n')}
              onChange={(e) =>
                patch({
                  platforms: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder={'Browser (desktop, mobile, tablet)\nMobile'}
            />
          </div>
        </div>
      </Section>

      <Section title="Categories & tags" icon={Tag}>
        {value.tags.map((tag, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Tag name"
              value={tag.label}
              onChange={(e) => updateTag(i, 'label', e.target.value)}
            />
            <input
              type="number"
              min={0}
              className={`${inputClass} w-24`}
              placeholder="Count"
              value={tag.count}
              onChange={(e) => updateTag(i, 'count', Number(e.target.value) || 0)}
            />
            <button
              type="button"
              onClick={() => patch({ tags: value.tags.filter((_, idx) => idx !== i) })}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ tags: [...value.tags, { label: '', count: 0 }] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add tag
        </button>
      </Section>

      <Section title="How to play" icon={ListOrdered}>
        {value.howToPlay.map((step, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-400 font-bold">Step {i + 1}</span>
              <button
                type="button"
                onClick={() => patch({ howToPlay: value.howToPlay.filter((_, idx) => idx !== i) })}
                className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              className={inputClass}
              placeholder="Step title"
              value={step.title}
              onChange={(e) => updateHowToPlay(i, 'title', e.target.value)}
            />
            <textarea
              className={`${inputClass} resize-y min-h-[60px]`}
              placeholder="Step description"
              value={step.body}
              onChange={(e) => updateHowToPlay(i, 'body', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ howToPlay: [...value.howToPlay, { title: '', body: '' }] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add step
        </button>
      </Section>

      <Section title="Game modes" icon={Gamepad2}>
        {value.gameModes.map((mode, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Mode name"
              value={mode.name}
              onChange={(e) => updateGameMode(i, 'name', e.target.value)}
            />
            <input
              className={`${inputClass} flex-[2]`}
              placeholder="Description"
              value={mode.desc}
              onChange={(e) => updateGameMode(i, 'desc', e.target.value)}
            />
            <button
              type="button"
              onClick={() => patch({ gameModes: value.gameModes.filter((_, idx) => idx !== i) })}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ gameModes: [...value.gameModes, { name: '', desc: '' }] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add mode
        </button>
      </Section>

      <Section title="Tips" icon={Lightbulb}>
        {value.tips.map((tip, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Tip text"
              value={tip}
              onChange={(e) => {
                const next = [...value.tips];
                next[i] = e.target.value;
                patch({ tips: next });
              }}
            />
            <button
              type="button"
              onClick={() => patch({ tips: value.tips.filter((_, idx) => idx !== i) })}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ tips: [...value.tips, ''] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add tip
        </button>
      </Section>

      <Section title="Features" icon={Sparkles}>
        {value.features.map((feat, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Feature text"
              value={feat}
              onChange={(e) => {
                const next = [...value.features];
                next[i] = e.target.value;
                patch({ features: next });
              }}
            />
            <button
              type="button"
              onClick={() => patch({ features: value.features.filter((_, idx) => idx !== i) })}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ features: [...value.features, ''] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add feature
        </button>
      </Section>

      <Section title="Controls & key bindings" icon={Keyboard}>
        {value.controls.map((ctrl, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Key / control"
              value={ctrl.key}
              onChange={(e) => updateControl(i, 'key', e.target.value)}
            />
            <input
              className={`${inputClass} flex-1`}
              placeholder="Action"
              value={ctrl.action}
              onChange={(e) => updateControl(i, 'action', e.target.value)}
            />
            <button
              type="button"
              onClick={() => patch({ controls: value.controls.filter((_, idx) => idx !== i) })}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => patch({ controls: [...value.controls, { key: '', action: '' }] })}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add control
        </button>
      </Section>
    </div>
  );
}
