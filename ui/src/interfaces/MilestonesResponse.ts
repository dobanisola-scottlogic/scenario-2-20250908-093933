export interface Milestone {
  id: string;
  milestoneClassName: string;
  timeStamp: number;
}

export type GetMilestoneResponse = Milestone[];
