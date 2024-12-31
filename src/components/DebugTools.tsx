import React, { useState } from 'react';
import { testReplicateConnection } from '../lib/replicate/test/api.test';
import { logger } from '../lib/utils/logger';

export default function DebugTools() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTest = async () => {
    setTesting(true);
    setResult('Testing API connection...');
    
    try {
      const success = await testReplicateConnection();
      setResult(success ? 'API connection successful' : 'API connection failed');
      logger.info('API test result:', success);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('API test error:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">API Debug Tools</h2>
      
      <button
        onClick={handleTest}
        disabled={testing}
        className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}