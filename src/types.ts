export type AgentState = {
  tick: number;
  score: number;
  lastReward: number;
  action: string;
  isHighReward: boolean;
  recentActions: string[];
  epsilon: number;
};

export type TreeNode = {
  id: string;
  name: string;
  value: number;
  children?: TreeNode[];
  _children?: TreeNode[]; // For collapsed state
};
