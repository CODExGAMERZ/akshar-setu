'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReaderRouteRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.documentId) {
      router.replace(`/read/${params.documentId}`);
    } else {
      router.replace('/library');
    }
  }, [params, router]);

  return null;
}
