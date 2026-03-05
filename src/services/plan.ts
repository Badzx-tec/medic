import { Plan } from '@prisma/client';

export const PLAN_LIMITS: Record<Plan, number> = {
  TRIAL: 1,
  BASIC: 5,
  PRO: 30
};
