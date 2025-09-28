'use client';

import { useEffect, useState } from 'react';

type Health = { db: boolean; docker: boolean } | null;

export default function HealthIndicator() {
  const [health, setHealth] = useState<Health>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001'}/platform/health`)
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ db: false, docker: false }));
  }, []);

  if (!health) {
    return <span>Comprobando...</span>;
  }

  return (
    <>
      <span>DB: {health.db ? '✅' : '⚠️'}</span>
      <span>Docker: {health.docker ? '✅' : '⚠️'}</span>
    </>
  );
}
