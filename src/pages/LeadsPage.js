import React, { useEffect, useState } from 'react';
import './LeadsPage.css';

function LeadsPage() {
  const [allLeads, setAllLeads] = useState([]); // All leads from API
  const [leads, setLeads] = useState([]); // Filtered leads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 5
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    score: '',
    city: '',
    intent: '',
    tags: '',
    name: ''
  });
  const [pendingFilters, setPendingFilters] = useState(filters); // For controlled inputs

  // Fetch all leads once
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `${process.env.REACT_APP_BACKEND_API_URL || ''}/api/leads?page=1&limit=10000`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API endpoint returned non-JSON response. Please check if the backend server is running.');
        }
        const data = await response.json();
        setAllLeads(Array.isArray(data.leads) ? data.leads : []);
      } catch (err) {
        setError(err.message || 'Error fetching leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Apply filters when Apply Filters button is clicked
  const applyFilters = () => {
    let filtered = allLeads;
    if (pendingFilters.name && pendingFilters.name.trim() !== '') {
      filtered = filtered.filter(lead =>
        lead.name && lead.name.toLowerCase().includes(pendingFilters.name.trim().toLowerCase())
      );
    }
    if (pendingFilters.status) {
      filtered = filtered.filter(lead => lead.status === pendingFilters.status);
    }
    if (pendingFilters.score) {
      filtered = filtered.filter(lead => lead.score === pendingFilters.score);
    }
    if (pendingFilters.city) {
      filtered = filtered.filter(lead =>
        lead.city && lead.city.toLowerCase().includes(pendingFilters.city.trim().toLowerCase())
      );
    }
    if (pendingFilters.intent) {
      filtered = filtered.filter(lead =>
        lead.intent && lead.intent.toLowerCase().includes(pendingFilters.intent.trim().toLowerCase())
      );
    }
    if (pendingFilters.tags) {
      filtered = filtered.filter(lead =>
        Array.isArray(lead.tags) && lead.tags.some(tag =>
          tag.toLowerCase().includes(pendingFilters.tags.trim().toLowerCase())
        )
      );
    }
    setFilters(pendingFilters);
    setLeads(filtered);
    setCurrentPage(1);
    setPagination({
      currentPage: 1,
      totalPages: Math.ceil(filtered.length / pageSize),
      totalCount: filtered.length,
      hasNextPage: filtered.length > pageSize,
      hasPrevPage: false,
      limit: pageSize
    });
  };

  // Update pagination when leads, currentPage, or pageSize changes
  useEffect(() => {
    const totalCount = leads.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    setPagination(prev => ({
      ...prev,
      currentPage,
      totalPages,
      totalCount,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      limit: pageSize
    }));
  }, [leads, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterInputChange = (filterName, value) => {
    setPendingFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setPendingFilters({
      status: '',
      score: '',
      city: '',
      intent: '',
      tags: '',
      name: ''
    });
    setFilters({
      status: '',
      score: '',
      city: '',
      intent: '',
      tags: '',
      name: ''
    });
    setLeads(allLeads);
    setCurrentPage(1);
  };

  // Pagination slice
  const startIdx = (pagination.currentPage - 1) * pagination.limit;
  const endIdx = startIdx + pagination.limit;
  const paginatedLeads = leads.slice(startIdx, endIdx);

  return (
    <div className="leads-list-container">
      <h2>Leads List</h2>
      {/* Filters Section */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="name-filter">Name:</label>
            <input
              id="name-filter"
              type="text"
              value={pendingFilters.name}
              onChange={(e) => handleFilterInputChange('name', e.target.value)}
              placeholder="Search by name..."
            />
          </div>
          <div className="filter-group">
            <label htmlFor="city-filter">City:</label>
            <input
              id="city-filter"
              type="text"
              value={pendingFilters.city}
              onChange={(e) => handleFilterInputChange('city', e.target.value)}
              placeholder="Filter by city..."
            />
          </div>
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={pendingFilters.status}
              onChange={(e) => handleFilterInputChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="score-filter">Score:</label>
            <select
              id="score-filter"
              value={pendingFilters.score}
              onChange={(e) => handleFilterInputChange('score', e.target.value)}
            >
              <option value="">All Scores</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="intent-filter">Intent:</label>
            <input
              id="intent-filter"
              type="text"
              value={pendingFilters.intent}
              onChange={(e) => handleFilterInputChange('intent', e.target.value)}
              placeholder="Filter by intent..."
            />
          </div>
          <div className="filter-group">
            <label htmlFor="tags-filter">Tags:</label>
            <input
              id="tags-filter"
              type="text"
              value={pendingFilters.tags}
              onChange={(e) => handleFilterInputChange('tags', e.target.value)}
              placeholder="Filter by tags..."
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
      </div>
      <div className="pagination-controls">
        <label>
          Records per page:
          <select value={pageSize} onChange={handlePageSizeChange}>
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>
      {loading && <div className="leads-status">Loading leads...</div>}
      {error && (
        <div className="leads-status error">
          {error}
          <br />
          <small style={{ marginTop: '10px', display: 'block' }}>
            Make sure your backend server is running and the API endpoint is available.
          </small>
        </div>
      )}
      {!loading && !error && pagination.totalCount === 0 && (
        <div className="leads-status">No leads found.</div>
      )}
      {!loading && !error && paginatedLeads.length > 0 && (
        <>
          <div className="leads-table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Product</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Intent</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead, idx) => (
                  <tr key={startIdx + idx}>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.city}</td>
                    <td>{lead.product}</td>
                    <td>{lead.user_message}</td>
                    <td>
                      <span className={`status-badge status-${lead.status || 'new'}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge score-${lead.score || 'medium'}`}>
                        {lead.score || 'Medium'}
                      </span>
                    </td>
                    <td>{lead.intent || '-'}</td>
                    <td>
                      {lead.tags && Array.isArray(lead.tags) && lead.tags.length > 0 ? (
                        <div className="tags-container">
                          {lead.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="tag">{tag}</span>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-bar">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={page === pagination.currentPage ? 'active' : ''}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
          <div className="pagination-info">
            Showing {startIdx + 1} to {Math.min(endIdx, pagination.totalCount)} of {pagination.totalCount} leads
          </div>
        </>
      )}
    </div>
  );
}

export default LeadsPage; 