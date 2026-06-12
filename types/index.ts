import { Database, Tables } from './database';

export * from './database';

// Custom Helper Types
export type Profile = Tables<'profiles'>;
export type Project = Tables<'projects'>;
export type Proposal = Tables<'proposals'>;
export type Contract = Tables<'contracts'>;
export type Task = Tables<'tasks'>;
export type KanbanColumn = Tables<'kanban_columns'>;
export type Conversation = Tables<'conversations'>;
export type Message = Tables<'messages'>;
export type Payment = Tables<'payments'>;
export type Invoice = Tables<'invoices'>;
export type Notification = Tables<'notifications'>;

// Extended types with relationships
export type ProjectWithClient = Project & {
  client: Profile;
};

export type ProposalWithFreelancer = Proposal & {
  freelancer: Profile;
};

export type ContractWithDetails = Contract & {
  project: Project;
  client: Profile;
  freelancer: Profile;
};

export type TaskWithAssignee = Task & {
  assignee: Profile | null;
};

export type MessageWithSender = Message & {
  sender: Profile;
};

export type ConversationWithParticipants = Conversation & {
  participants: Profile[];
};

export type KanbanColumnWithTasks = KanbanColumn & {
  tasks: TaskWithAssignee[];
};
