import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Test Page</h1>
        <p className="text-gray-600">If you can see this, routing is working!</p>
      </div>
    </div>
  );
};

export default Test; 