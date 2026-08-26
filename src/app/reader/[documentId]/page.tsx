'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ReaderView } from '@/components/reader/ReaderView';

export default function ReaderDocumentIdPage() {
  const params = useParams();
  const { selectDocument, activeDocument } = useApp();

  useEffect(() => {
    const id = params?.documentId as string;
    if (id && (!activeDocument || activeDocument.id !== id)) {
      selectDocument(id);
    }
  }, [params, selectDocument, activeDocument]);

  return <ReaderView />;
}
