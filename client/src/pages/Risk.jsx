import React, { useMemo, useState } from "react";

const QUESTIONS = [
  { key: "dangerNow", q: "Are you in immediate danger right now?", a: ["Yes", "Not sure", "No"] },
  { key: "threats", q: "Has someone threatened you recently?", a: ["Yes", "No"] },
  { key: "injury", q: "Have you been physically hurt in the last 30 days?", a: ["Yes", "No"] },
  { key: "stalking", q: "Are you being followed / watched / stalked?", a: ["Yes", "No"] },
  { key: "support", q: "Do you have a safe place you can go today?", a: ["Yes", "No"] },
];

export default function Risk() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const score = useMemo(() => {
    let s = 0;
    if (answers.dangerNow === "Yes") s += 3;
    if (answers.dangerNow === "Not sure") s += 2;
    if (answers.threats === "Yes") s += 2;
    if (answers.injury === "Yes") s += 3;
    if (answers.stalking === "Yes") s += 2;
    if (answers.support === "No") s += 2;
    return s;
  }, [answers]);

  const level =
    score >= 8 ? "High" : score >= 4 ? "Medium" : "Low";

  const current = QUESTIONS[step];

  const pick = (val) => {
    setAnswers((p) => ({ ...p, [current.key]: val }));
  };

  const next = () => setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => { setStep(0); setAnswers({}); };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">Risk Assessment</h2>
        <p className="text-white/60 mt-2">
          Quick step-by-step questions. You can press SOS anytime.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/60">Step {step + 1} of {QUESTIONS.length}</div>
        <div className="text-lg font-semibold mt-2">{current.q}</div>

        <div className="mt-4 grid gap-2">
          {current.a.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(opt)}
              className={
                "text-left px-4 py-3 rounded-2xl border transition " +
                (answers[current.key] === opt
                  ? "bg-white/10 border-white/25"
                  : "bg-black/20 border-white/10 hover:bg-white/5")
              }
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={prev} disabled={step === 0} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40">
            Back
          </button>

          <div className="text-sm">
            <span className="text-white/60">Risk level:</span>{" "}
            <span className={level === "High" ? "text-red-300" : level === "Medium" ? "text-yellow-300" : "text-emerald-300"}>
              {level}
            </span>
          </div>

          <button onClick={next} disabled={step === QUESTIONS.length - 1} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 disabled:opacity-40">
            Next
          </button>
        </div>

        <div className="mt-4">
          <button onClick={reset} className="text-xs text-white/50 hover:text-white/70">Reset</button>
        </div>
      </div>
    </div>
  );
}