"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { quiz, scoreQuiz, type QuizAnswers, type QuizResult } from "@/lib/questionnaire";

interface QuestionnaireProps {
  onApply: (result: QuizResult) => void;
  onCancel: () => void;
}

export function Questionnaire({ onApply, onCancel }: QuestionnaireProps) {
  const t = useTranslations("studio");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const answeredAny = Object.values(answers).some((a) => a && a !== "notSure");

  return (
    <div className="rounded-2xl border border-ink/15 bg-paper p-4 sm:p-5">
      <h3 className="text-sm font-semibold">{t("quizTitle")}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{t("quizIntro")}</p>
      <ol className="mt-5 space-y-5">
        {quiz.map((q, i) => (
          <li key={q.id}>
            <fieldset>
              <legend className="text-sm font-medium">
                <span className="mr-1.5 text-faint">{i + 1}.</span>
                {t(`q.${q.id}.q`)}
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[...q.options.map((o) => o.id), "notSure"].map((id) => {
                  const active = answers[q.id] === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: id }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "bg-ink text-paper"
                          : id === "notSure"
                            ? "border border-dashed border-line text-muted hover:border-ink/30"
                            : "border border-line bg-surface hover:border-ink/30"
                      }`}
                    >
                      {id === "notSure" ? t("notSure") : t(`q.${q.id}.${id}`)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!answeredAny}
          onClick={() => onApply(scoreQuiz(answers))}
          className="btn-primary px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("quizApply")}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-5 py-2.5">
          {t("quizCancel")}
        </button>
      </div>
    </div>
  );
}
