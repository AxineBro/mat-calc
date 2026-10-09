import { postJson } from './http';

const INFO_BASE = '/api/info';

export type SolutionStepDto = {
  title: string | null;
  formula: string | null;
  substitution: string | null;
  result: string | null;
  note: string | null;
};

export type SolutionSectionDto = {
  title: string;
  summary: string | null;
  steps: SolutionStepDto[];
};

export type SolutionResponseDto = {
  answer: string;
  sections: SolutionSectionDto[];
};

export function solveMarginals(
  probabilities: number[][],
  signal?: AbortSignal,
): Promise<SolutionResponseDto> {
  return postJson<SolutionResponseDto>(
    `${INFO_BASE}/marginals`,
    { probabilities },
    signal,
  );
}

export function solveConditionals(
  probabilities: number[][],
  signal?: AbortSignal,
): Promise<SolutionResponseDto> {
  return postJson<SolutionResponseDto>(
    `${INFO_BASE}/conditionals`,
    { probabilities },
    signal,
  );
}

export function solveEntropy(
  probabilities: number[][],
  signal?: AbortSignal,
): Promise<SolutionResponseDto> {
  return postJson<SolutionResponseDto>(
    `${INFO_BASE}/entropy`,
    { probabilities },
    signal,
  );
}