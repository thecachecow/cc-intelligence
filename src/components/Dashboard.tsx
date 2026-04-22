import React, { useEffect, useState } from 'react';
import { db, onSnapshot, collection, query, where, OperationType, handleFirestoreError, Timestamp } from '../firebase';
import { Reveal, Counter } from './Layout';
import { Activity, ShieldAlert, TrendingUp } from 'lucide-react';

interface Animal {
  id: string;
  name: string;
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdate: Timestamp;
}

interface HealthEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Timestamp;
  animalId: string;
}

export const Dashboard = ({ userId }: { userId: string }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const animalsQuery = query(collection(db, 'animals'), where('rancherUid', '==', userId));
    const eventsQuery = query(collection(db, 'healthEvents'), where('rancherUid', '==', userId));

    const unsubAnimals = onSnapshot(animalsQuery, (snapshot) => {
      setAnimals(snapshot.docs.map(doc => ({ ...doc.data() } as Animal)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'animals'));

    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthEvent)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'healthEvents'));

    return () => {
      unsubAnimals();
      unsubEvents();
    };
  }, [userId]);

  if (loading) return <div className="py-20 text-center text-muted font-light tracking-widest uppercase text-[10px]">Synchronizing biological asset stream...</div>;

  const stats = {
    total: animals.length,
    warning: animals.filter(a => a.status === 'warning').length,
    critical: animals.filter(a => a.status === 'critical').length,
    avgHealth: animals.length ? Math.round(animals.reduce((acc, a) => acc + a.healthScore, 0) / animals.length) : 0
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Asset Count", val: stats.total, icon: Activity, color: "text-brand" },
          { label: "Aggregate Health Index", val: stats.avgHealth, suffix: "%", icon: TrendingUp, color: "text-accent" },
          { label: "Active Risk Warnings", val: stats.warning, icon: ShieldAlert, color: "text-ink" },
          { label: "Critical Anomalies", val: stats.critical, icon: ShieldAlert, color: "text-red-600" },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.1} className="editorial-card p-6 border-rule/30">
            <div className="flex justify-between items-start mb-4">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-4xl font-serif font-bold text-ink mb-1 tracking-tight">
              <Counter value={s.val} suffix={s.suffix} />
            </div>
            <div className="micro-label text-muted">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h3 className="font-serif text-2xl font-bold text-ink mb-8">Asset Status Matrix</h3>
          <div className="editorial-card overflow-x-auto border-rule/30">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-bg text-muted">
                <tr>
                  <th className="p-4 micro-label">Asset ID</th>
                  <th className="p-4 micro-label">Health Index</th>
                  <th className="p-4 micro-label">Risk Status</th>
                  <th className="p-4 micro-label">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/50">
                {animals.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-muted font-light">No biological assets instrumented.</td></tr>
                ) : (
                  animals.map((a) => (
                    <tr key={a.id} className="hover:bg-bg/50 transition-colors">
                      <td className="p-4 font-medium text-ink">{a.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1 bg-rule rounded-full overflow-hidden w-24">
                            <div 
                              className={`h-full transition-all duration-500 ${a.healthScore > 80 ? 'bg-brand' : a.healthScore > 50 ? 'bg-accent' : 'bg-red-500'}`} 
                              style={{ width: `${a.healthScore}%` }} 
                            />
                          </div>
                          <span className="font-medium text-ink">{a.healthScore}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border ${
                          a.status === 'healthy' ? 'bg-brand/10 text-brand border-brand/20' : 
                          a.status === 'warning' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted font-light">{a.lastUpdate.toDate().toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl font-bold text-ink mb-8">Anomaly Log</h3>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="p-12 text-center text-muted border border-dashed border-rule rounded-waabi font-light">No anomalies detected in the current stream.</div>
            ) : (
              events.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()).slice(0, 5).map((e) => (
                <div key={e.id} className="editorial-card p-5 flex gap-5 hover:border-brand/30 transition-colors border-rule/30">
                  <div className={`w-1 shrink-0 rounded-full ${
                    e.severity === 'high' ? 'bg-red-500' : e.severity === 'medium' ? 'bg-accent' : 'bg-brand'
                  }`} />
                  <div className="flex-1">
                    <div className="text-[14px] font-bold text-ink mb-1">{e.type}</div>
                    <div className="text-[11px] text-muted mb-3 font-light">Asset: {e.animalId} • {e.timestamp.toDate().toLocaleTimeString()}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-[0.15em] ${
                      e.severity === 'high' ? 'text-red-600' : e.severity === 'medium' ? 'text-accent' : 'text-brand'
                    }`}>
                      {e.severity} Severity
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
