import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">SYNAPSE Dashboard</h1>
      <p className="mb-2">Welcome to the SYNAPSE admin console.</p>
      <ul className="list-disc pl-5">
        <li><Link to="/api/v1/cases/ping" className="text-indigo-600 hover:underline">Cases endpoint health</Link></li>
        <li><Link to="/api/v1/institutions/ping" className="text-indigo-600 hover:underline">Institutions endpoint health</Link></li>
        <li><Link to="/api/v1/overlaps/ping" className="text-indigo-600 hover:underline">Overlaps endpoint health</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
