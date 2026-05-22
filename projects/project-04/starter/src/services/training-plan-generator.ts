import { RiskItem, TrainingTask } from '../types';
import { createId } from './id';

export function generateTrainingPlan(risks: RiskItem[]): TrainingTask[] {
  return risks.map(risk => ({
    id: createId('task'),
    sessionId: risk.sessionId,
    title: `Practice: ${risk.title}`,
    taskType: risk.title.includes('Project evidence') ? 'project-story' : 'deep-dive-drill',
    instructions:
      'Rewrite the answer using a clear structure: personal responsibility, technical decision, trade-off, metric or validation evidence, and a failure or boundary case.',
    sourceRiskItemIds: [risk.id],
  }));
}
