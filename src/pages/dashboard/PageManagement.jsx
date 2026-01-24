import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageManagement = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    content: {
      ar: {},
      en: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all pages
  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pages`);
      setPages(response.data.data.pages);
      setError(null);
    } catch (err) {
      setError('Failed to load pages');
      console.error('Error loading pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle content changes for Arabic/English
  const handleContentChange = (lang, key, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [key]: value
        }
      }
    }));
  };

  // Handle adding a new key-value pair to content
  const addContentField = (lang) => {
    const key = prompt(`Enter key for ${lang.toUpperCase()} content:`);
    if (key) {
      const value = prompt(`Enter value for ${lang.toUpperCase()} content [${key}]:`);
      if (value !== null) {
        handleContentChange(lang, key, value);
      }
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing page
        await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pages/${currentPage._id}`, formData);
      } else {
        // Create new page
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pages`, formData);
      }

      // Reset form and reload pages
      setFormData({ name: '', slug: '', content: { ar: {}, en: {} } });
      setIsEditing(false);
      setCurrentPage(null);
      loadPages();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error('Error saving page:', err);
    }
  };

  // Edit a page
  const handleEdit = (page) => {
    setCurrentPage(page);
    setIsEditing(true);

    // Safely extract content, handling both nested (schema) and root (potential legacy/malformed) structures
    const arContent = page.content?.ar || page.ar || {};
    const enContent = page.content?.en || page.en || {};

    setFormData({
      name: page.name,
      slug: page.slug,
      content: {
        ar: arContent,
        en: enContent
      }
    });
  };

  // Delete a page
  const handleDelete = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pages/${pageId}`);
        loadPages();
      } catch (err) {
        setError('Failed to delete page');
        console.error('Error deleting page:', err);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPage(null);
    setFormData({ name: '', slug: '', content: { ar: {}, en: {} } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Page' : 'Create New Page'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter page name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave empty to auto-generate from name"
            />
          </div>
        </div>

        {/* Arabic Content Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Arabic Content</h3>
            <button
              type="button"
              onClick={() => addContentField('ar')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Add Field
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(formData.content.ar || {}).map(([key, value]) => (
              <div key={key} className="p-3 border rounded-md bg-gray-50">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {key}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => handleContentChange('ar', key, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="2"
                  placeholder={`Enter Arabic ${key}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newContent = { ...formData.content };
                    delete newContent.ar[key];
                    setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                  className="mt-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* English Content Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">English Content</h3>
            <button
              type="button"
              onClick={() => addContentField('en')}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Add Field
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(formData.content.en || {}).map(([key, value]) => (
              <div key={key} className="p-3 border rounded-md bg-gray-50">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {key}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => handleContentChange('en', key, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="2"
                  placeholder={`Enter English ${key}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newContent = { ...formData.content };
                    delete newContent.en[key];
                    setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                  className="mt-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Page' : 'Create Page'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Pages List */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Existing Pages</h3>

        {pages.length === 0 ? (
          <p className="text-gray-500 italic">No pages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageManagement;