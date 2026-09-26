'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentCard } from './DocumentCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { UploadCloud, Sparkles, BookOpen, Search, ArrowUpDown, AlertTriangle } from 'lucide-react';

type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'subject' | 'progress';

export const DocumentLibrary: React.FC = () => {
  const { documents, navigateToReader, deleteDocument, setIsUploadModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [docToDelete, setDocToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ['All', 'Science', 'History', 'English', 'Mathematics', 'General'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.pages.some(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'recent') {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    if (sortBy === 'subject') {
      return a.category.localeCompare(b.category);
    }
    if (sortBy === 'progress') {
      return (b.progressPercent || 0) - (a.progressPercent || 0);
    }
    return 0;
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


      {/* Search, Category Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
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

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <label htmlFor="library-sort" className="text-xs font-semibold text-[#706655] hidden sm:flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort:
          </label>
          <select
            id="library-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-2.5 py-1.5 rounded-xl bg-[#FAF3E0] border border-[#E7DFCA] text-xs font-semibold text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
            <option value="subject">Subject / Category</option>
            <option value="progress">Reading Progress %</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {sortedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onOpen={() => navigateToReader(doc.id)}
              onDelete={() => setDocToDelete({ id: doc.id, title: doc.title })}
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

      {/* Delete Confirmation Modal (Fix 12) */}
      <Modal
        isOpen={!!docToDelete}
        onClose={() => !isDeleting && setDocToDelete(null)}
        title="Remove Document?"
        subtitle="This will permanently delete this lesson and its reading progress."
        maxWidth="sm"
      >
        <div className="space-y-4 text-[#26231E]">
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs text-[#991B1B]">
              Are you sure you want to remove <strong>&ldquo;{docToDelete?.title}&rdquo;</strong> from your library?
            </p>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E7DFCA]">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDocToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              disabled={isDeleting}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white border-transparent"
              onClick={async () => {
                if (!docToDelete) return;
                setIsDeleting(true);
                try {
                  await deleteDocument(docToDelete.id);
                } finally {
                  setIsDeleting(false);
                  setDocToDelete(null);
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Lesson'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
