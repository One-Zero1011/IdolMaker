import { ANALYSTS_LOGS } from './analysts';
import { DIPLOMATS_LOGS } from './diplomats';
import { SENTINELS_LOGS } from './sentinels';
import { EXPLORERS_LOGS } from './explorers';
import { MBTI } from '../../types/index';

export const MBTI_LOGS: Record<MBTI, string[]> = {
  ...ANALYSTS_LOGS,
  ...DIPLOMATS_LOGS,
  ...SENTINELS_LOGS,
  ...EXPLORERS_LOGS
};

export const getRandomMbtiLog = (mbti: MBTI): string => {
  const logs = MBTI_LOGS[mbti];
  if (!logs || logs.length === 0) return "오늘도 열심히 연습했습니다.";
  return logs[Math.floor(Math.random() * logs.length)];
};