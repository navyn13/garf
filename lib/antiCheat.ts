const MAX_SCORE_PER_SECOND = 3;
const MIN_GAME_DURATION = 5;
const MAX_SCORE_ABSOLUTE = 10000;

export interface ScoreValidation {
  isValid: boolean;
  reason?: string;
}

export function validateScore(
  score: number,
  duration: number,
  timestamp: number
): ScoreValidation {
  if (score < 0) {
    return { isValid: false, reason: "Score cannot be negative" };
  }

  if (score > MAX_SCORE_ABSOLUTE) {
    return { isValid: false, reason: "Score exceeds maximum allowed" };
  }

  if (duration < MIN_GAME_DURATION && score > 0) {
    return { isValid: false, reason: "Game duration too short" };
  }

  const scorePerSecond = duration > 0 ? score / duration : score;
  if (scorePerSecond > MAX_SCORE_PER_SECOND) {
    return {
      isValid: false,
      reason: `Score rate too high: ${scorePerSecond.toFixed(2)}/s (max: ${MAX_SCORE_PER_SECOND}/s)`,
    };
  }

  const now = Date.now();
  const timeDiff = Math.abs(now - timestamp);
  if (timeDiff > 60000) {
    return { isValid: false, reason: "Timestamp too old or invalid" };
  }

  return { isValid: true };
}

export async function checkDuplicateSubmission(
  walletAddress: string,
  score: number,
  timestamp: number,
  recentScores: Array<{ wallet_address: string; score: number; timestamp: number }>
): Promise<ScoreValidation> {
  const recentSubmissions = recentScores.filter(
    (s) =>
      s.wallet_address === walletAddress &&
      timestamp - s.timestamp < 5000
  );

  if (recentSubmissions.length > 0) {
    return { isValid: false, reason: "Duplicate submission detected" };
  }

  return { isValid: true };
}
