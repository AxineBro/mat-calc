import { Latex } from './Latex';
import { MathText } from './MathText';
import type {
  SolutionSectionDto,
  SolutionStepDto,
} from '../api/infoApi';

type Props = {
  sections: SolutionSectionDto[];
  answer: string;
};

export function SolutionSteps({ sections, answer }: Props) {
  return (
    <div className="sections">
      {sections.map((s, si) => (
        <section key={si} className="section">
          <h3 className="section__title">
            <MathText>{s.title}</MathText>
          </h3>

          {s.steps.map((st, i) => (
            <Step key={i} step={st} />
          ))}

          {s.summary && (
            <div className="section__summary">
              <MathText>{s.summary}</MathText>
            </div>
          )}
        </section>
      ))}

      <div className="sections__answer">
        <MathText>{answer}</MathText>
      </div>
    </div>
  );
}

function Step({ step }: { step: SolutionStepDto }) {
  const hasContent =
    step.title || step.formula || step.substitution || step.result || step.note;
  if (!hasContent) return null;

  return (
    <div className="step">
      {step.title && (
        <div className="step__title">
          <MathText>{step.title}</MathText>
        </div>
      )}
      {step.formula && (
        <div className="step__formula">
          <Latex tex={step.formula} displayMode />
        </div>
      )}
      {step.substitution && (
        <div className="step__substitution">
          <Latex tex={step.substitution} displayMode />
        </div>
      )}
      {step.result && (
        <div className="step__result">
          <MathText>{step.result}</MathText>
        </div>
      )}
      {step.note && (
        <div className="step__note">
          <MathText>{step.note}</MathText>
        </div>
      )}
    </div>
  );
}