'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentCard } from './DocumentCard';
import { Button } from '../common/Button';
import { UploadCloud, Sparkles, BookOpen, Search } from 'lucide-react';

export const DocumentLibrary: React.FC = () => {
  const { documents, navigateToReader, deleteDocument, setIsUploadModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Science', 'History', 'English', 'Mathematics', 'General'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DFCA] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1B18] tracking-tight">
            Document Library
          </h1>
          <p className="text-xs sm:text-sm text-[#706655] mt-1">
            Your collection of digitized textbooks, stories, and educational materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              if (confirm('Reset library to default educational lessons? Any custom uploads will be cleared.')) {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('aksharsetu_documents_v1');
                  window.location.reload();
                }
              }
            }}
          >
            Reset Library
          </Button>

          <Button
            variant="accent"
            size="md"
            icon={<UploadCloud className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Document (PDF/OCR)
          </Button>
        </div>
      </div>


      {/* Search & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, terms, or stories..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF3E0] border border-[#E7DFCA] text-xs sm:text-sm text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40"
          />
          <Search className="w-4 h-4 text-[#8C7A5D] absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#26231E] text-[#FEF9EB] shadow-xs'
                  : 'bg-[#FAF3E0] text-[#524B40] hover:text-[#26231E] hover:bg-[#EFE8D6] border border-[#E7DFCA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onOpen={() => navigateToReader(doc.id)}
              onDelete={() => deleteDocument(doc.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF9EB] text-[#8C7A5D] flex items-center justify-center mx-auto border border-[#E7DFCA]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1E1B18]">No documents found</h3>
            <p className="text-xs text-[#706655]">
              {searchQuery ? 'Try adjusting your search terms or filters.' : 'Upload your first document or PDF to start reading.'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<UploadCloud className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload New Document
          </Button>
        </div>
      )}
    </div>
  );
};
