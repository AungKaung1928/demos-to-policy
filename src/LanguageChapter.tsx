import { useState } from 'react'
import { allInsideSpread, encoders, source, splits } from './data/language'
import type { Split } from './data/language'
import { useLang } from './i18n'

const MAX = 0.25 // axis top, success rate

const T = {
  en: {
    eyebrow: 'Chapter 5',
    title: 'An ablation with no power',
    intro:
      'A small language-conditioned policy, trained three ways: two text encoders with FiLM conditioning, and one without FiLM. Which one is best? At a base success of 3–14%, the data cannot say.',
    split: 'Instructions',
    names: {
      seen: 'Seen (training templates)',
      paraphrase: 'Paraphrase (held-out templates)',
      combo: 'Combo (held-out task + colour)',
    } as Record<Split, string>,
    chart: 'Success, mean ± sd over 5 evaluation seeds',
    inside: 'Every encoder sits inside the others’ ± sd here: the ranking is noise.',
    outside: 'At least one encoder is outside another’s spread here.',
    note: 'Two things are real. Held-out combinations of task and colour collapse for every encoder (0.03), so the policy did not learn to compose words. And the comparison between encoders only becomes a test once the base policy works; a fix to the data comes before an ablation.',
    caveat:
      'Simulated SO-100 arm, 4 tasks pooled, 20 episodes × 5 evaluation seeds per (task, colour) cell, one training seed per encoder, 162 training episodes. The axis stops at 0.25.',
  },
  ja: {
    eyebrow: '第 5 章',
    title: '検出力のないアブレーション',
    intro:
      '言語で条件づけた小さな方策を 3 通りに学習します。FiLM 条件づけ付きの 2 種類のテキストエンコーダと、FiLM なしの 1 種類です。どれが一番良いか。基本の成功率が 3–14% では、データからは言えません。',
    split: '指示文',
    names: {
      seen: '既知 (学習時のテンプレート)',
      paraphrase: '言い換え (未使用のテンプレート)',
      combo: '組み合わせ (未使用のタスク × 色)',
    } as Record<Split, string>,
    chart: '成功率 (評価シード 5 つの平均 ± 標準偏差)',
    inside: 'ここではどのエンコーダも他の ± 標準偏差の内側にあります。順位はノイズです。',
    outside: 'ここでは少なくとも 1 つのエンコーダが他のばらつきの外側にあります。',
    note: '確かなことは 2 つです。未使用のタスクと色の組み合わせでは、どのエンコーダも崩れます (0.03)。方策は単語を組み合わせることを学んでいません。そしてエンコーダの比較は、基本の方策が動くようになって初めて検定になります。アブレーションの前にデータを直すべきです。',
    caveat:
      'シミュレーションの SO-100 アーム、4 タスクをまとめて集計、(タスク, 色) ごとに 20 エピソード × 評価シード 5、エンコーダごとに学習シード 1、学習エピソード 162。軸の上限は 0.25 です。',
  },
}

export function LanguageChapter() {
  const t = T[useLang()]
  const [split, setSplit] = useState<Split>('seen')
  const pct = (v: number) => `${(Math.min(Math.max(v, 0), MAX) / MAX) * 100}%`
  return (
    <>
      <section className="intro chapter-break" id="language">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="panel" aria-labelledby="lang-h">
        <h2 id="lang-h">{t.chart}</h2>
        <div className="seg seg-wrap" role="group" aria-label={t.split}>
          {splits.map((s) => (
            <button key={s} id={`split-${s}`} type="button" aria-pressed={split === s} onClick={() => setSplit(s)}>
              {t.names[s]}
            </button>
          ))}
        </div>
        <ul className="bars wide-value">
          {encoders.map((e) => {
            const [m, sd] = e.score[split]
            return (
              <li key={e.id}>
                <span className="bar-label" lang="en">
                  {e.label}
                </span>
                <span className="bar-track">
                  <span className="bar win" style={{ width: pct(m) }} />
                  <span className="bar-sd" style={{ left: pct(m - sd), width: `calc(${pct(m + sd)} - ${pct(m - sd)})` }} />
                </span>
                <span className="bar-value num">
                  {m.toFixed(3)} ± {sd.toFixed(3)}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="readout">{allInsideSpread(split) ? t.inside : t.outside}</p>
        <p className="muted">{t.note}</p>
        <p className="muted">{t.caveat}</p>
        <p className="muted">
          <a href={`https://${source.ref}`} lang="en">
            {source.label}
          </a>
        </p>
      </section>
    </>
  )
}
