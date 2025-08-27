"use client";

import { useAuth } from "../auth/AuthProvider";
import AppOverview from "./AppOverview";
import { Page } from "ditwaru-aws-helpers";

interface AppOverviewWrapperProps {
  data: Page[];
  tableName: string;
}

export default function AppOverviewWrapper({ data, tableName }: AppOverviewWrapperProps) {
  const { isVisitor } = useAuth();

  // Visitors cannot edit anything
  const canEdit = !isVisitor;

  return <AppOverview data={data} tableName={tableName} canEdit={canEdit} />;
}
