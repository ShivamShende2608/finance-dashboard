'use client';
import AppShell from '../../components/layout/AppShell';
import InsightsPanel from '../../components/insights/InsightsPanel';

export default function InsightsPage() {
  return (
    <AppShell title="Insights" subtitle="Smart analysis of your spending habits">
      <InsightsPanel />
    </AppShell>
  );
}
