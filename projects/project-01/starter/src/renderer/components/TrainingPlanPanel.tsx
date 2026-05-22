import { TrainingTask } from '../../types';
import { ReportSection } from './FollowUpChainView';

interface Props {
  tasks: TrainingTask[];
}

export function TrainingPlanPanel({ tasks }: Props) {
  return (
    <ReportSection title="Training Plan">
      {tasks.map(task => (
        <div key={task.id} style={{ marginBottom: 12 }}>
          <strong>{task.title}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{task.instructions}</div>
        </div>
      ))}
    </ReportSection>
  );
}
