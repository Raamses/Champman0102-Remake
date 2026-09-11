/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import AppShell from './components/AppShell';

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-brand-muted">
      <div className="w-12 h-12 rounded border-2 border-dashed border-brand-border" />
      <p className="text-[11px] font-bold uppercase tracking-widest">{label} — coming in a later phase</p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('database');

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      <Placeholder label={activeTab} />
    </AppShell>
  );
}
