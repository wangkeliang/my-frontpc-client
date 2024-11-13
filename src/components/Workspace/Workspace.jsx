// src/components/ContentArea/Workspace/Workspace.jsx
import React from 'react';
import FilterBar from '../FilterBar/FilterBar';
import DataTable from '../DataTable/DataTable';
import Pagination from '../Pagination/Pagination';

const Workspace = () => {
  return (
    <div className="workspace">
      <FilterBar />
      <DataTable />
      <Pagination />
    </div>
  );
};

export default Workspace;
