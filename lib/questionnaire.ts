/**
 * "Not sure?" questionnaire. Most people can't name their undertone or chroma, but they
 * can answer everyday questions about how colours behave on them. Each answer adds
 * evidence; "not sure" adds none, so unanswered questions never invent a signal.
 */

import type { Profile } from "@/lib/profile";

interface Evidence {
  /** -1 cool … +1 warm */
  undertone?: number;
  /** 0 … 1 */
  olive?: number;
  /** -1 soft … +1 clear */
  clarity?: number;
}

export interface QuizQuestion {
  id: string;
  options: { id: string; evidence: Evidence }[];
}

export const quiz: QuizQuestion[] = [
  {
    id: "metal",
    options: [
      { id: "gold", evidence: { undertone: 0.8 } },
      { id: "silver", evidence: { undertone: -0.8 } },
      { id: "both", evidence: { undertone: 0 } }
    ]
  },
  {
    id: "white",
    options: [
      { id: "pure", evidence: { undertone: -0.4, clarity: 0.6 } },
      { id: "ivory", evidence: { undertone: 0.5, clarity: -0.2 } },
      { id: "same", evidence: {} }
    ]
  },
  {
    id: "vivid",
    options: [
      { id: "glow", evidence: { clarity: 0.9 } },
      { id: "wears", evidence: { clarity: -0.8 } },
      { id: "depends", evidence: { clarity: 0 } }
    ]
  },
  {
    id: "blush",
    options: [
      { id: "pink", evidence: { undertone: -0.6 } },
      { id: "peach", evidence: { undertone: 0.6 } },
      { id: "both", evidence: { undertone: 0 } }
    ]
  },
  {
    id: "foundation",
    options: [
      { id: "pinkWrong", evidence: { undertone: 0.6 } },
      { id: "yellowWrong", evidence: { undertone: -0.6 } },
      { id: "bothOff", evidence: { olive: 1, clarity: -0.3 } },
      { id: "neutralFine", evidence: { undertone: 0 } }
    ]
  }
];

export type QuizAnswers = Record<string, string | undefined>;

export interface QuizResult {
  patch: Partial<Pick<Profile, "undertone" | "olive" | "clarity">>;
  answered: number;
}

function mean(values: number[]): number | undefined {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : undefined;
}

export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const u: number[] = [];
  const c: number[] = [];
  let olive = 0;
  let answered = 0;
  for (const q of quiz) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    answered++;
    if (opt.evidence.undertone !== undefined) u.push(opt.evidence.undertone);
    if (opt.evidence.clarity !== undefined) c.push(opt.evidence.clarity);
    if (opt.evidence.olive) olive = Math.max(olive, opt.evidence.olive);
  }
  const patch: QuizResult["patch"] = {};
  const um = mean(u);
  const cm = mean(c);
  if (um !== undefined) patch.undertone = Math.round(Math.max(-50, Math.min(50, um * 50)));
  if (cm !== undefined) patch.clarity = Math.round(Math.max(0, Math.min(100, 50 + cm * 45)));
  if (answers.foundation !== undefined && answers.foundation !== "notSure") patch.olive = olive >= 0.5;
  return { patch, answered };
}
