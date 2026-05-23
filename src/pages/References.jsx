import { Search, Tag, Book, FileText, ChevronDown, Check, Trash2, Bookmark, BookOpen, Users, GraduationCap, Globe, X, Terminal, PenTool, RefreshCw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import './References.css';

const GENERIC_CATEGORIES = ['All', 'Survey', 'Journal', 'Conference', 'Book', 'Thesis', 'Preprint', 'Website'];

const getCategoryIcon = (category, size = 16, className = "") => {
  switch (category.toLowerCase()) {
    case 'all':
      return <Bookmark size={size} className={className} />;
    case 'survey':
      return <FileText size={size} className={className} />;
    case 'journal':
      return <BookOpen size={size} className={className} />;
    case 'conference':
      return <Users size={size} className={className} />;
    case 'book':
      return <Book size={size} className={className} />;
    case 'thesis':
      return <GraduationCap size={size} className={className} />;
    case 'preprint':
      return <FileText size={size} className={className} />;
    case 'website':
      return <Globe size={size} className={className} />;
    default:
      return <Tag size={size} className={className} />;
  }
};

const getTagClass = (tag) => {
  const t = tag.toLowerCase();
  if (t === 'journal') return 'tag-blue';
  if (t === 'conference') return 'tag-purple';
  if (t === 'book') return 'tag-green';
  if (t === 'survey') return 'tag-orange';
  if (t === 'thesis') return 'tag-indigo';
  if (t === 'preprint') return 'tag-pink';
  if (t === 'website') return 'tag-teal';
  return 'tag-default';
};

const parseBibTeX = (bibText) => {
  try {
    const typeMatch = bibText.match(/@(\w+)\s*\{/);
    if (!typeMatch) return null;
    const type = typeMatch[1].toLowerCase();
    
    const getField = (field) => {
      const regex = new RegExp(`${field}\\s*=\\s*[{"]([^"}]+)[}"]`, 'i');
      const match = bibText.match(regex);
      return match ? match[1] : '';
    };

    const title = getField('title');
    const author = getField('author');
    const year = getField('year');
    const doi = getField('doi');
    
    let category = 'Journal';
    if (type === 'book') category = 'Book';
    else if (type === 'inproceedings' || type === 'proceedings') category = 'Conference';
    else if (type === 'thesis' || type === 'phdthesis' || type === 'mastersthesis') category = 'Thesis';
    else if (type === 'misc' || type === 'online') category = 'Website';
    else if (type === 'article') category = 'Journal';
    else category = 'Preprint';

    const cleanedAuthors = author.replace(/\s+and\s+/gi, ', ');

    return {
      title: title || 'Untitled parsed reference',
      authors: cleanedAuthors || 'Unknown Author',
      year: year || new Date().getFullYear().toString(),
      doi: doi || '',
      tags: [category, 'BibTeX']
    };
  } catch (e) {
    console.error('BibTeX parse error', e);
    return null;
  }
};

const scrapeWebsite = async (url) => {
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let htmlText = '';
  let fetched = false;
  let fetchError = null;

  // 1. Try corsproxy.io (direct raw fetch)
  try {
    const response = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`);
    if (response.ok) {
      htmlText = await response.text();
      fetched = true;
    } else {
      fetchError = new Error(`HTTP error ${response.status}`);
    }
  } catch (e) {
    console.warn('corsproxy.io failed, trying allorigins fallback...', e);
    fetchError = e;
  }

  // 2. Fallback to allorigins.win JSON wrapper endpoint (extremely reliable for CORS)
  if (!fetched) {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.contents) {
          htmlText = data.contents;
          fetched = true;
        } else {
          fetchError = new Error('Empty response from allorigins');
        }
      } else {
        fetchError = new Error(`AllOrigins HTTP error ${response.status}`);
      }
    } catch (e) {
      console.error('AllOrigins fallback failed...', e);
      fetchError = e;
    }
  }

  if (!fetched) {
    throw fetchError || new Error('Failed to fetch site metadata from all proxies');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  // Title extraction with multiple fallbacks
  let title = '';
  const titleSelectors = [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'meta[name="title"]'
  ];
  for (const selector of titleSelectors) {
    const content = doc.querySelector(selector)?.getAttribute('content');
    if (content && content.trim()) {
      title = content.trim();
      break;
    }
  }
  if (!title) {
    title = doc.querySelector('title')?.textContent || '';
  }
  if (!title) {
    title = doc.querySelector('h1')?.textContent || '';
  }
  title = title.replace(/\s+/g, ' ').trim();

  // Site Name extraction
  let siteName = '';
  const siteNameSelectors = [
    'meta[property="og:site_name"]',
    'meta[name="twitter:site"]',
    'meta[name="publisher"]'
  ];
  for (const selector of siteNameSelectors) {
    const content = doc.querySelector(selector)?.getAttribute('content') || doc.querySelector(selector)?.getAttribute('value');
    if (content && content.trim()) {
      siteName = content.trim();
      break;
    }
  }
  if (!siteName) {
    try {
      siteName = new URL(targetUrl).hostname.replace('www.', '');
    } catch (_) {
      siteName = 'Website';
    }
  }

  // Author extraction with multiple fallbacks
  let author = '';
  const authorSelectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[name="twitter:creator"]',
    'meta[name="dcterms.creator"]',
    '.author',
    '.byline',
    '[itemprop="author"]'
  ];
  for (const selector of authorSelectors) {
    const element = doc.querySelector(selector);
    const content = element?.getAttribute('content') || element?.textContent;
    if (content && content.trim()) {
      author = content.trim();
      break;
    }
  }
  if (!author) {
    author = siteName;
  }
  author = author.replace(/\s+/g, ' ').trim();

  // Publication Year extraction with multiple fallbacks
  let year = '';
  const dateSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="pubdate"]',
    'meta[name="date"]',
    'meta[name="dcterms.date"]',
    'meta[name="dcterms.issued"]',
    'time[datetime]',
    'meta[property="og:updated_time"]'
  ];
  for (const selector of dateSelectors) {
    const element = doc.querySelector(selector);
    const dateStr = element?.getAttribute('content') || element?.getAttribute('datetime') || element?.textContent;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        year = d.getFullYear().toString();
        break;
      }
    }
  }
  
  // Try to find a 4-digit number starting with 19 or 20 in any other date meta tag or URL
  if (!year) {
    const yearMatch = targetUrl.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }
  }
  
  if (!year) {
    year = new Date().getFullYear().toString();
  }

  return {
    title: title || 'Webpage Reference',
    authors: author,
    year: year,
    doi: targetUrl,
    tags: ['Website', siteName].filter(Boolean)
  };
};

function References() {
  const { references, addReference, updateReferenceTitle, deleteReference, searchQuery, setSearchQuery } = useProjects();
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('webpage'); // 'webpage', 'bibtex', 'manual'
  const [webpageUrl, setWebpageUrl] = useState('');
  const [bibtexText, setBibtexText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapeError, setScrapeError] = useState('');
  const [modalRefData, setModalRefData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear().toString(),
    doi: '',
    category: 'Journal',
    tags: ''
  });

  const handleAddReference = () => {
    setIsModalOpen(true);
    setActiveTab('webpage');
    setWebpageUrl('');
    setBibtexText('');
    setIsLoading(false);
    setScrapeError('');
    setModalRefData({
      title: '',
      authors: '',
      year: new Date().getFullYear().toString(),
      doi: '',
      category: 'Journal',
      tags: ''
    });
  };

  const handleModalFieldChange = (e) => {
    const { name, value } = e.target;
    setModalRefData(prev => ({ ...prev, [name]: value }));
  };

  const handleScrape = async () => {
    let urlToScrape = webpageUrl.trim();
    if (!urlToScrape) {
      setScrapeError('Please enter a URL');
      return;
    }
    
    // Add protocol if missing
    if (!/^https?:\/\//i.test(urlToScrape)) {
      urlToScrape = 'https://' + urlToScrape;
    }

    try {
      new URL(urlToScrape);
    } catch (e) {
      setScrapeError('Please enter a valid URL (e.g. google.com or https://google.com)');
      return;
    }

    setIsLoading(true);
    setScrapeError('');
    try {
      const data = await scrapeWebsite(urlToScrape);
      setModalRefData({
        title: data.title,
        authors: data.authors,
        year: data.year,
        doi: data.doi,
        category: 'Website',
        tags: data.tags.filter(t => t !== 'Website').join(', ')
      });
    } catch (err) {
      console.error(err);
      const isNetworkError = err.message && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') || 
        err.message.includes('network') ||
        err.message.includes('type error') ||
        err.message.includes('TypeError')
      );
      if (isNetworkError) {
        setScrapeError('Network error: The metadata proxy was blocked (possibly by your browser\'s ad-blocker or tracking protection). Please disable shields/ad-blockers or fill the fields below manually.');
      } else {
        setScrapeError('Failed to automatically retrieve metadata. You can fill the details manually below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBibtexChange = (e) => {
    const text = e.target.value;
    setBibtexText(text);
    
    if (!text.trim()) return;

    const data = parseBibTeX(text);
    if (data) {
      setModalRefData({
        title: data.title,
        authors: data.authors,
        year: data.year,
        doi: data.doi,
        category: data.tags[0] || 'Journal',
        tags: data.tags.slice(2).join(', ') // any other tags if they existed
      });
    }
  };

  const handleSaveReference = (e) => {
    e.preventDefault();
    if (!modalRefData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    const customTags = modalRefData.tags
      ? modalRefData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];
    
    const finalTags = [modalRefData.category];
    customTags.forEach(t => {
      if (!finalTags.some(existing => existing.toLowerCase() === t.toLowerCase())) {
        finalTags.push(t);
      }
    });

    addReference({
      title: modalRefData.title.trim(),
      authors: modalRefData.authors.trim() || 'Unknown Author',
      year: modalRefData.year.trim() || new Date().getFullYear().toString(),
      doi: modalRefData.doi.trim(),
      tags: finalTags
    });

    setIsModalOpen(false);
  };

  const handleGenerateBibliography = () => {
    const bibText = references.map(ref => 
      `${ref.authors} (${ref.year}). ${ref.title}. ${ref.doi ? `DOI: ${ref.doi}` : ''}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(bibText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClose = () => setIsDropdownOpen(false);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, [isDropdownOpen]);

  // Extract all unique project tags (filtering out generic categories)
  const genericLower = GENERIC_CATEGORIES.map(c => c.toLowerCase());
  const projectTags = Array.from(
    new Set(
      references
        .flatMap(ref => ref.tags || [])
        .filter(tag => !genericLower.includes(tag.toLowerCase()))
    )
  );

  const filteredRefs = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ref.authors.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || ref.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div className="page-container">
      <div className="page-header references-header">
        <div>
          <h1 className="page-title">References</h1>
          <p className="page-subtitle">{references.length} references in your library</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-outline" onClick={handleGenerateBibliography}>
            {copied ? <Check size={16} className="text-green-500" /> : <FileText size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Bibliography'}
          </button>
          <button className="btn-primary" onClick={handleAddReference}>
            + Add Reference
          </button>
        </div>
      </div>

      <div className="references-toolbar">
        <div className="search-bar flex-fill">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search references..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown-container">
          <button 
            id="filter-dropdown-toggle"
            className={`btn-filter ${selectedTag !== 'All' ? 'active-filter' : ''}`}
            aria-expanded={isDropdownOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {getCategoryIcon(selectedTag, 16, selectedTag !== 'All' ? 'text-primary' : 'text-muted')}
            <span className="filter-label">{selectedTag}</span>
            <ChevronDown size={16} className={`text-muted dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="filter-dropdown-menu card" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-section-header">Categories</div>
              {GENERIC_CATEGORIES.map(category => (
                <button 
                  key={category}
                  className={`dropdown-item ${selectedTag === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTag(category);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="dropdown-item-icon">
                    {getCategoryIcon(category)}
                  </span>
                  {category}
                </button>
              ))}
              
              {projectTags.length > 0 && (
                <>
                  <hr className="dropdown-divider" />
                  <div className="dropdown-section-header">Project Tags</div>
                  {projectTags.map(tag => (
                    <button 
                      key={tag}
                      className={`dropdown-item ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-item-icon">
                        {getCategoryIcon(tag)}
                      </span>
                      {tag}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="references-list">
        {filteredRefs.length === 0 ? (
          <div className="empty-state card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <Search size={40} className="empty-icon" style={{ opacity: 0.4, marginBottom: '1rem', color: 'var(--color-text-muted)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No references found</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>We couldn't find any references matching your search or filter.</p>
            <button className="btn-outline" onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRefs.map((ref, i) => (
            <div className="reference-card card" key={i}>
              <div className="ref-icon-container">
                <Book size={20} className="ref-icon" />
              </div>
              
              <div className="ref-content">
                {editingId === ref.id ? (
                  <input 
                    type="text" 
                    className="ref-title-input"
                    value={ref.title}
                    onChange={(e) => updateReferenceTitle(ref.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter') setEditingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <h3 className="ref-title" onClick={() => setEditingId(ref.id)} style={{cursor: 'pointer'}} title="Click to edit">
                    {ref.title}
                  </h3>
                )}
                <p className="ref-authors">{ref.authors} · {ref.year}</p>
                {ref.doi && <p className="ref-doi">DOI: {ref.doi}</p>}
              </div>
              
              <div className="ref-tags">
                {ref.tags.map(tag => (
                  <span className={`style-tag ${getTagClass(tag)}`} key={tag}>{tag}</span>
                ))}
                <button 
                  className="btn-icon delete-ref-btn" 
                  onClick={() => deleteReference(ref.id)}
                  title="Delete Reference"
                  style={{marginLeft: '0.5rem', color: '#ef4444'}}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>Add Reference</h2>
                <p>Add a new reference to your library using one of three import methods.</p>
              </div>
              <button className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <div className="modal-tabs">
              <button 
                type="button"
                className={`modal-tab-btn ${activeTab === 'webpage' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('webpage');
                  setScrapeError('');
                }}
              >
                <Globe size={16} />
                Cite Webpage
              </button>
              <button 
                type="button"
                className={`modal-tab-btn ${activeTab === 'bibtex' ? 'active' : ''}`}
                onClick={() => setActiveTab('bibtex')}
              >
                <Terminal size={16} />
                BibTeX Import
              </button>
              <button 
                type="button"
                className={`modal-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
              >
                <PenTool size={16} />
                Manual Entry
              </button>
            </div>

            <form onSubmit={handleSaveReference} className="modal-form">
              <div className="modal-body">
                {activeTab === 'webpage' && (
                  <div className="tab-section webpage-tab">
                    <div className="form-group">
                      <label htmlFor="webpage-url">Webpage URL</label>
                      <div className="input-group">
                        <input 
                          id="webpage-url"
                          type="text" 
                          placeholder="e.g., https://en.wikipedia.org/wiki/Quantum_computing"
                          value={webpageUrl}
                          onChange={(e) => {
                            setWebpageUrl(e.target.value);
                            setScrapeError('');
                          }}
                          className={scrapeError ? 'input-error' : ''}
                        />
                        <button 
                          type="button" 
                          className="btn-primary btn-scrape" 
                          onClick={handleScrape}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RefreshCw size={16} className="spin-loader" />
                          ) : (
                            'Fetch Details'
                          )}
                        </button>
                      </div>
                      {scrapeError && <span className="error-text">{scrapeError}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'bibtex' && (
                  <div className="tab-section bibtex-tab">
                    <div className="form-group">
                      <label htmlFor="bibtex-input">BibTeX Source Code</label>
                      <textarea 
                        id="bibtex-input"
                        rows="4"
                        placeholder={`e.g., @article{attention2017,
  title={Attention Is All You Need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki},
  year={2017}
}`}
                        value={bibtexText}
                        onChange={handleBibtexChange}
                      />
                      <p className="field-hint">Fields below will auto-populate as you paste or edit the BibTeX code.</p>
                    </div>
                  </div>
                )}

                {/* Common Editable Fields Area */}
                <div className="modal-fields-divider">
                  <span>Reference Details</span>
                </div>

                <div className="form-grid">
                  <div className="form-group col-full">
                    <label htmlFor="ref-title">Title <span className="required-star">*</span></label>
                    <input 
                      id="ref-title"
                      type="text" 
                      name="title"
                      required
                      placeholder="Title of the paper, article, or webpage"
                      value={modalRefData.title}
                      onChange={handleModalFieldChange}
                    />
                  </div>

                  <div className="form-group col-half">
                    <label htmlFor="ref-authors">Author(s)</label>
                    <input 
                      id="ref-authors"
                      type="text" 
                      name="authors"
                      placeholder="e.g., Jane Doe, John Smith"
                      value={modalRefData.authors}
                      onChange={handleModalFieldChange}
                    />
                  </div>

                  <div className="form-group col-half">
                    <label htmlFor="ref-year">Year</label>
                    <input 
                      id="ref-year"
                      type="text" 
                      name="year"
                      placeholder="e.g., 2026"
                      value={modalRefData.year}
                      onChange={handleModalFieldChange}
                    />
                  </div>

                  <div className="form-group col-half">
                    <label htmlFor="ref-doi">DOI / Link</label>
                    <input 
                      id="ref-doi"
                      type="text" 
                      name="doi"
                      placeholder="e.g., 10.1007/qc2026 or URL"
                      value={modalRefData.doi}
                      onChange={handleModalFieldChange}
                    />
                  </div>

                  <div className="form-group col-half">
                    <label htmlFor="ref-category">Category</label>
                    <div className="select-wrapper">
                      <select 
                        id="ref-category"
                        name="category"
                        value={modalRefData.category}
                        onChange={handleModalFieldChange}
                      >
                        <option value="Journal">Journal</option>
                        <option value="Survey">Survey</option>
                        <option value="Conference">Conference</option>
                        <option value="Book">Book</option>
                        <option value="Thesis">Thesis</option>
                        <option value="Preprint">Preprint</option>
                        <option value="Website">Website</option>
                      </select>
                      <ChevronDown size={16} className="select-chevron" />
                    </div>
                  </div>

                  <div className="form-group col-full">
                    <label htmlFor="ref-tags">Custom Tags</label>
                    <input 
                      id="ref-tags"
                      type="text" 
                      name="tags"
                      placeholder="e.g., Quantum Physics, Literature (comma separated)"
                      value={modalRefData.tags}
                      onChange={handleModalFieldChange}
                    />
                    <p className="field-hint">Add custom tags separated by commas to organize your research library.</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default References;
