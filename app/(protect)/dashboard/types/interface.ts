export type DashboardStats = {
  ticket: {
    pendingApproval: number;
    inProgress: number;
    totalCompleted: number;
  };
  form: {
    newForms: number;
    pendingReview: number;
  };
  finance: {
    depositsHeld: number;
    refundsAccumulated: number;
    outstandingPayments: number;
  };
};

export type AlertItem = {
  id: string;
  type: "slip" | "refund";
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
};

export type ActivityItem = {
  id: number;
  type: "status_changed";
  message: string;
  actor: string;
  actorId: number | null;
  createdAt: string;
};
