import React from 'react';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';

const ExportButton = ({ data, filename = 'extracted-data' }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
      data: data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(blob, `${filename}-${timestamp}.json`);
  };

  const isDisabled = !data || data.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className="btn-primary flex items-center space-x-2"
      title={isDisabled ? 'No data to export' : 'Export data as JSON'}
    >
      <Download className="w-4 h-4" />
      <span>Export JSON</span>
    </button>
  );
};

export default ExportButton;