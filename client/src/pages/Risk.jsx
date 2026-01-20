import React, { useState } from "react";

const QUESTIONS = [
    "Do you feel unsafe at home?",
    "Has someone threatened you recently?",
    "Are you being controlled financially or socially?",
    "Have you experienced physical harm in the past 30 days?"
];

export default function Risk() {
    const [answers, setAnswers] = useState(() => QUESTIONS.map(() => false));

    const score = answers.reduce((a, v) => a + (v ? 1 : 0), 0);
    const level = score >= 3 ? "High" : score === 2 ? "Medium" : "Low";

    return (
        <div>
            <h1 className="text-xl font-semibold">Risk Check</h1>
            <p className="mt-1 text-sm text-white/70">
                Quick demo assessment (not medical advice).
            </p>

            <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                {QUESTIONS.map((q, i) => (
                    <label key={i} className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={answers[i]}
                            onChange={(e) => {
                                const next = [...answers];
                                next[i] = e.target.checked;
                                setAnswers(next);
                            }}
                            className="mt-1"
                        />
                        <div className="text-white/90">{q}</div>
                    </label>
                ))}
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Result</div>
                <div className="mt-1 text-sm text-white/80">
                    Risk level: <span className="font-semibold text-white">{level}</span> ({score}/{QUESTIONS.length})
                </div>
                <div className="mt-2 text-xs text-white/60">
                    If you�re in danger, use SOS immediately.
                </div>
            </div>
        </div>
    );
}
