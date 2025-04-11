'use client';

import { useState } from 'react';
import EstablishmentDetail from '@/components/EstablishmentDetail';

export default function EstablishmentPage() {
  const [showDetail, setShowDetail] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Food Establishment Demo</h1>
        <button
          onClick={() => setShowDetail(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Show Establishment Detail
        </button>
      </div>

      {/* Establishment Detail Modal */}
      {showDetail && (
        <EstablishmentDetail onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
}
