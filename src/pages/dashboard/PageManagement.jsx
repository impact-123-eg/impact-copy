import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaCode, FaEye } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const PageManagement = () => {
  const [pages, setPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editing Mode: 'visual' or 'json'
  const [editMode, setEditMode] = useState('visual');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    content: {
      ar: {},
      en: {}
    }
  });

  // Temporary strings for JSON editing mode to prevent parsing errors while typing
  const [jsonAr, setJsonAr] = useState('{}');
  const [jsonEn, setJsonEn] = useState('{}');

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/pages`);
      setPages(response.data.data.pages || []);
    } catch (err) {
      toast.error('Failed to load pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  // Keyboard shortcut Ctrl+Q to toggle edit mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setEditMode(prev => prev === 'visual' ? 'json' : 'visual');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync JSON strings when formData content changes (for when switching to JSON mode)
  useEffect(() => {
    if (editMode === 'json') {
      setJsonAr(JSON.stringify(formData.content.ar, null, 2));
      setJsonEn(JSON.stringify(formData.content.en, null, 2));
    }
  }, [editMode, formData.content]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVisualContentChange = (lang, key, value) => {
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

  const handleAddKey = () => {
    const key = prompt('Enter new translation key:');
    if (!key) return;

    setFormData(prev => ({
      ...prev,
      content: {
        ar: { ...prev.content.ar, [key]: '' },
        en: { ...prev.content.en, [key]: '' }
      }
    }));
  };

  const handleRemoveKey = (key) => {
    if (!window.confirm(`Are you sure you want to remove the key "${key}"?`)) return;

    setFormData(prev => {
      const newAr = { ...prev.content.ar };
      const newEn = { ...prev.content.en };
      delete newAr[key];
      delete newEn[key];
      return {
        ...prev,
        content: { ar: newAr, en: newEn }
      };
    });
  };

  const handleJsonUpdate = (lang, value) => {
    if (lang === 'ar') setJsonAr(value);
    else setJsonEn(value);

    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [lang]: parsed
        }
      }));
    } catch (e) {
      // Allow invalid JSON while typing, but don't update state
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', slug: '', content: { ar: {}, en: {} } });
    setJsonAr('{}');
    setJsonEn('{}');
    setIsModalOpen(true);
  };

  const openEditModal = (page) => {
    setIsEditing(true);
    setEditId(page._id);
    setFormData({
      name: page.name,
      slug: page.slug,
      content: {
        ar: page.content?.ar || {},
        en: page.content?.en || {}
      }
    });
    setJsonAr(JSON.stringify(page.content?.ar || {}, null, 2));
    setJsonEn(JSON.stringify(page.content?.en || {}, null, 2));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final JSON validation if in JSON mode
    if (editMode === 'json') {
      try {
        JSON.parse(jsonAr);
        JSON.parse(jsonEn);
      } catch (e) {
        toast.error('Invalid JSON content detected. Please fix it before saving.');
        return;
      }
    }

    setSaving(true);
    try {
      if (isEditing) {
        await axios.patch(`${API_BASE_URL}/pages/${editId}`, formData);
        toast.success('Page updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/pages`, formData);
        toast.success('Page created successfully');
      }
      setIsModalOpen(false);
      loadPages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/pages/${id}`);
      toast.success('Page deleted successfully');
      loadPages();
    } catch (err) {
      toast.error('Failed to delete page');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  // Get unique keys from both ar and en content
  const allKeys = Array.from(new Set([
    ...Object.keys(formData.content.ar),
    ...Object.keys(formData.content.en)
  ]));

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Page Management</h2>
          <p className="text-gray-500 mt-1">Manage localized content for your platform pages</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-modern bg-[var(--Yellow)] text-[var(--Main)] hover:scale-105 active:scale-95"
        >
          <FaPlus /> Add New Page
        </button>
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[var(--Main)] transition-colors">{page.name}</h3>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">/{page.slug}</span>
              </div>
              <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(page)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Page"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(page._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Page"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic">Keys count:</span>
                <span className="font-bold text-[var(--Main)]">{Object.keys(page.content?.en || {}).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic">Last updated:</span>
                <span className="text-gray-400">{new Date(page.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No pages found. Start by adding a new one!</p>
          </div>
        )}
      </div>

      {/* Large Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditing ? `Editing: ${formData.name}` : 'Create New Page'}
                </h3>
                <p className="text-sm text-gray-500">
                  Press <kbd className="px-1 py-0.5 rounded bg-gray-200 text-gray-900 font-mono">Ctrl+Q</kbd> to toggle editing mode
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-1 rounded-xl border flex shadow-sm">
                  <button
                    onClick={() => setEditMode('visual')}
                    className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all ${editMode === 'visual' ? 'bg-[var(--Yellow)] text-[var(--Main)]' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <FaEye /> Visual
                  </button>
                  <button
                    onClick={() => setEditMode('json')}
                    className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all ${editMode === 'json' ? 'bg-[var(--Yellow)] text-[var(--Main)]' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <FaCode /> JSON
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form id="page-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Page Title</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Hero Section"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Unique Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. hero-section"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent transition-all outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-gray-800">Translations Content</h4>
                    {editMode === 'visual' && (
                      <button
                        type="button"
                        onClick={handleAddKey}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-bold"
                      >
                        <FaPlus size={12} /> Add New Key
                      </button>
                    )}
                  </div>

                  {editMode === 'visual' ? (
                    <div className="space-y-4">
                      {allKeys.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 border-2 border-dashed rounded-3xl">
                          <p className="text-gray-400">No content keys yet. Add one to get started!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {allKeys.map((key) => (
                            <div key={key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                              <button
                                type="button"
                                onClick={() => handleRemoveKey(key)}
                                className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                                title="Remove Key"
                              >
                                <FaTrash size={12} />
                              </button>

                              <h5 className="text-[var(--Main)] font-mono text-sm font-bold mb-3 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                                <FaCode size={12} /> {key}
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Arabic (RTL)</label>
                                  <textarea
                                    value={formData.content.ar[key] || ''}
                                    onChange={(e) => handleVisualContentChange('ar', key, e.target.value)}
                                    dir="rtl"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-[var(--Yellow)] focus:bg-white transition-all outline-none min-h-[80px]"
                                    placeholder="النص بالعربية..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">English (LTR)</label>
                                  <textarea
                                    value={formData.content.en[key] || ''}
                                    onChange={(e) => handleVisualContentChange('en', key, e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-[var(--Yellow)] focus:bg-white transition-all outline-none min-h-[80px]"
                                    placeholder="English text..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* JSON Mode */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Arabic JSON</label>
                        <textarea
                          value={jsonAr}
                          onChange={(e) => handleJsonUpdate('ar', e.target.value)}
                          className="flex-1 w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm rounded-2xl border-none focus:ring-2 focus:ring-[var(--Yellow)] outline-none custom-scrollbar"
                          spellCheck="false"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">English JSON</label>
                        <textarea
                          value={jsonEn}
                          onChange={(e) => handleJsonUpdate('en', e.target.value)}
                          className="flex-1 w-full px-4 py-3 bg-gray-900 text-blue-300 font-mono text-sm rounded-2xl border-none focus:ring-2 focus:ring-[var(--Yellow)] outline-none custom-scrollbar"
                          spellCheck="false"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                form="page-form"
                type="submit"
                disabled={saving}
                className="btn-modern bg-[var(--Yellow)] text-[var(--Main)] w-[200px]"
              >
                {saving ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[var(--Main)] border-t-transparent animate-spin rounded-full" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaCheck /> {isEditing ? 'Save Changes' : 'Create Page'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageManagement;