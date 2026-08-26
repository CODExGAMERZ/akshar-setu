'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';

export default function ReaderBaseRedirect() {
  const router = useRouter();
  const { currentDocument, documents } = useReader();

  useEffect(() => {
    const targetId = currentDocument?.id || documents[0]?.id;
    if (targetId) {
      router.replace(`/read/${targetId}`);
    } else {
      router.replace('/library');
    }
  }, [currentDocument, documents, router]);

  return null;
}
