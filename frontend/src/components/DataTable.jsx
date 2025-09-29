import React from 'react';
import { User, Mail, Phone, Code, FileText, CheckCircle, XCircle } from 'lucide-react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No data extracted yet</p>
        <p className="text-sm">Upload a PDF to see extracted information here</p>
      </div>
    );
  }

  // Add error boundary for data processing
  try {
    const getIconForColumn = (column) => {
      switch (column.toLowerCase()) {
        case 'name': return <User className="w-4 h-4" />;
        case 'email': return <Mail className="w-4 h-4" />;
        case 'phone': return <Phone className="w-4 h-4" />;
        case 'skills': return <Code className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    };

  const formatCellValue = (value, column, rowData) => {
    if (!value) return 'N/A';
    
    // Handle nameValidation object specifically 
    if (column.toLowerCase() === 'namevalidation') {
      if (typeof value === 'object' && value !== null) {
        return (
          <div className={`flex items-center space-x-1 text-xs ${
            value.nameMatchesFilename ? 'text-green-600' : 'text-red-600'
          }`}>
            {value.nameMatchesFilename ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>
              {value.nameMatchesFilename 
                ? 'Name matches filename' 
                : 'Name does not match filename'
              }
            </span>
          </div>
        );
      }
      return 'N/A';
    }
    
    if (column.toLowerCase() === 'skills' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }
    
    if (column.toLowerCase() === 'filename') {
      const nameValidation = rowData.nameValidation;
      return (
        <div className="space-y-1">
          <div className="font-mono text-xs">{value}</div>
          {nameValidation && typeof nameValidation === 'object' && (
            <div className={`flex items-center space-x-1 text-xs ${
              nameValidation.nameMatchesFilename ? 'text-green-600' : 'text-red-600'
            }`}>
              {nameValidation.nameMatchesFilename ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              <span>
                {nameValidation.nameMatchesFilename 
                  ? 'Name matches filename' 
                  : 'Name does not match filename'
                }
              </span>
            </div>
          )}
        </div>
      );
    }
    
    if (column.toLowerCase() === 'email') {
      return (
        <a 
          href={`mailto:${value}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      );
    }
    
    if (column.toLowerCase() === 'phone') {
      return (
        <a 
          href={`tel:${value}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      );
    }
    
    // Handle any other objects that might be rendered
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      // For objects, stringify them safely
      return JSON.stringify(value);
    }
    
    return value;
  };

  // Get all unique keys from the data, excluding internal fields
  const columns = data.length > 0 ? Object.keys(data[0]).filter(key => 
    key !== 'id' && key !== 'nameValidation'
  ) : [];

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Extracted Data</h3>
        <p className="text-sm text-gray-500 mt-1">
          {data.length} {data.length === 1 ? 'record' : 'records'} extracted
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-2">
                    {getIconForColumn(column)}
                    <span>{column}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatCellValue(row[column], column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error rendering data table:', error);
    return (
      <div className="text-center py-12 text-red-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-red-300" />
        <p className="text-lg font-medium">Error displaying data</p>
        <p className="text-sm">Please try uploading the file again</p>
      </div>
    );
  }
};

export default DataTable;