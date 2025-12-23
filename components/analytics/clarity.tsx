'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

interface ClarityAnalyticsProps {
  projectId?: string;
}

export function ClarityAnalytics({
  projectId,
}: ClarityAnalyticsProps) {
  useEffect(() => {
    // projectIdがプロパティとして渡された場合、または環境変数から取得できた場合に初期化
    const id =
      projectId ||
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (id) {
      Clarity.init(id);
    }
  }, [projectId]);

  return null;
}
