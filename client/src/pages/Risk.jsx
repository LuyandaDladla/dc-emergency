import { useMemo, useState } from "react";
import { api } from "../services/api.js";

const QUESTIONS = [
  { key: "q1", text: "Do you feel unsafe at home or where you live?" },
  { key: "q2", text: "Has anyone threatened you recently?" },
  { key: "q3", text: "Are you being controlled (money, phone, movement)?" },
  { key: "q4", text: "Have you been physically harmed recently?" },
  { key: "q5", text: "Do you fear retaliation if you report?" },
  { key: "q6", text: "Is there a history of violence or escalation?" },
  { key: "q7", text: "Are children or dependents at risk?" },
  { key: "q8", text: "Do you have a safe person you can contact today?" }
];

const CHOICES = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Dangerous", value: 3 }
];

export default function Risk() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const current = QUESTIONS[step];
  const progress = useMemo(() => Math.round(((step) / QUESTIONS.length) * 100), [step]);

  const pick = (val) => {
    const next = { ...answers, [current.key]: val };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  const submit = async () => {
    const r = await api.post("/risk/assess", { answers });
    setResult(r.data);
  };

  const donePercent = Math.round(((step + 1) / QUESTIONS.length) * 100);

  if (result) {
    const level = String(result.level || "").toUpperCase();
    return (
      <div className="stack">
        <div className="card">
          <div className="h1">Risk Result</div>
          <div className="small">This is not a medical diagnosis — it is a safety indicator.</div>
          <div className="hr"></div>

          <div className="row">
            <div className="badge">Level: {level}</div>
            <div className="badge">Score: {result.score}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            {(result.recommendations || []).map((x, i) => (
              <div key={i} style={{ marginBottom: 8 }}>- {x}</div>
            ))}
          </div>

          <div className="hr"></div>
          <div className="row">
            <button className="btn btnPrimary" onClick={() => window.location.href="/sos"}>Go to SOS</button>
            <button className="btn" onClick={() => window.location.reload()}>Retake</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <div>
            <div className="h1">Risk Assessment</div>
            <div className="small">Step {step + 1} of {QUESTIONS.length}</div>
          </div>
          <div className="space"></div>
          <div className="badge">{donePercent}%</div>
        </div>

        <div style={{ marginTop: 12 }} className="progress">
          <div style={{ width: donePercent + "%" }}></div>
        </div>

        <div className="hr"></div>

        <div className="h2">{current.text}</div>
        <div className="choiceGrid">
          {CHOICES.map(c => (
            <button
              key={c.value}
              className={"choice" + ((answers[current.key] === c.value) ? " selected" : "")}
              onClick={() => pick(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="hr"></div>
        <div className="row">
          <button className="btn" onClick={back} disabled={step === 0}>Back</button>
          <div className="space"></div>
          <button
            className="btn btnPrimary"
            onClick={submit}
            disabled={Object.keys(answers).length < QUESTIONS.length}
          >
            Get Result
          </button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          If you are in immediate danger, do not finish the questionnaire — press SOS now.
        </div>
      </div>
    </div>
  );
}