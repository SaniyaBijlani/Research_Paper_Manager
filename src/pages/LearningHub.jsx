import React, { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, Star, User, Calendar, Clock, X, Sparkles } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import realBlogsCache from '../data/real_blogs_cache.json';
import './LearningHub.css';

// 6 General Video Tutorials (All verified active IDs)
const GENERAL_VIDEOS = [
  {
    id: 'gv1',
    title: 'How To Write A Research Paper In 3 EASY Steps',
    youtubeId: 'PSO7A1ybjRE',
    duration: '15 min',
    popular: true,
    category: 'Tutorial',
    color: 'blue',
    summary: 'A comprehensive guide showing how to plan, outline, write, and critique your paper iteratively.'
  },
  {
    id: 'gv2',
    title: 'How to Write a Research Paper: 9-Step Guide',
    youtubeId: 'uZBV-jPmhMA',
    duration: '18 min',
    popular: true,
    category: 'Course',
    color: 'purple',
    summary: 'Master the core steps of academic writing, research formulation, outlining, and editing.'
  },
  {
    id: 'gv3',
    title: 'How to Write a Research Paper (Chegg Guide)',
    youtubeId: '6GRUFuAhj6E',
    duration: '12 min',
    popular: false,
    category: 'Guide',
    color: 'green',
    summary: 'Discover literature gaps, formulate a thesis, and organize structure for draft success.'
  },
  {
    id: 'gv4',
    title: 'EGU WEBINARS: How to write a research paper',
    youtubeId: 'JPZCDTB_mSk',
    duration: '10 min',
    popular: false,
    category: 'Tutorial',
    color: 'orange',
    summary: 'Learn structure, flow, and journal expectations from professional academic editors.'
  },
  {
    id: 'gv5',
    title: 'How to Write a Full Research Paper in 24 Hours',
    youtubeId: 'YdpFu6Fkr58',
    duration: '22 min',
    popular: false,
    category: 'Course',
    color: 'blue',
    summary: 'Deep dive into practical layouts, section drafting flow, and reference managers.'
  },
  {
    id: 'gv6',
    title: 'How to Read a Scientific Paper (Practical Advice)',
    youtubeId: 'zC5xPVrzTfk',
    duration: '14 min',
    popular: true,
    category: 'Guide',
    color: 'purple',
    summary: 'Uncommon but practical methods to analyze publications, evaluate arguments, and capture data.'
  }
];

// Offline Fallback Blogs (Curated, Standard Academic Guides)
// Mapping of academic fields of study to relevant Dev.to tags
const FIELD_TAGS_MAP = {
  'computer science': ['computerscience', 'ai', 'machinelearning', 'programming'],
  'software engineering': ['softwareengineering', 'webdev', 'programming'],
  'mathematics': ['math', 'mathematics', 'science'],
  'statistics': ['statistics', 'datascience', 'data'],
  'physics': ['physics', 'science'],
  'chemistry': ['chemistry', 'science'],
  'biology': ['biology', 'science'],
  'medicine': ['medicine', 'health', 'science'],
  'psychology': ['psychology', 'science'],
  'economics': ['economics', 'finance'],
  'history': ['history', 'humanities'],
  'literature': ['literature', 'writing'],
  'engineering': ['engineering', 'hardware'],
  'sociology': ['sociology', 'humanities'],
  'philosophy': ['philosophy', 'humanities']
};

const STANDARD_FIELDS = [
  'Computer Science',
  'Software Engineering',
  'Mathematics',
  'Statistics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Psychology',
  'Economics',
  'History',
  'Literature',
  'Engineering',
  'Sociology',
  'Philosophy'
];

// Flexible Mapping of 15+ Academic Fields of Study to Video Tutorials (All active IDs)
const INTEREST_VIDEOS_MAP = {
  'computer science': [
    { title: 'How to Write a Computer Science Research Paper', youtubeId: 'cKxRvEZd3Mw', duration: '14 min', category: 'CS', summary: 'Tailored guide to CS methodology, structure, and peer review.' },
    { title: 'Neural Networks & Deep Learning Explained', youtubeId: 'aircAruvnKk', duration: '18 min', category: 'AI / ML', summary: 'Visual breakdown of AI/ML models and experimental setups.' }
  ],
  'software engineering': [
    { title: 'How to Write a Computer Science Research Paper', youtubeId: 'cKxRvEZd3Mw', duration: '14 min', category: 'SE', summary: 'Writing conventions, data gathering, and analysis in Software Engineering.' },
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Iterative design, documentation, and drafting strategies.' }
  ],
  'mathematics': [
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Formulating rigorous proofs and structuring academic arguments.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'How to dissect complex equations and logical flows.' }
  ],
  'statistics': [
    { title: 'Research Methodology 101: Simple Explainer', youtubeId: 'TEqYnV6KWfY', duration: '15 min', category: 'Stats', summary: 'Comprehensive introduction to quantitative data modeling and analysis.' },
    { title: 'What Is Research Methodology? Full Step-by-Step Tutorial', youtubeId: 'nJza2kfI8GU', duration: '20 min', category: 'Methodology', summary: 'Sampling strategies, data collection, and statistical validity.' }
  ],
  'physics': [
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Structuring experiments, detailing equations, and drafting.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Critiquing experimental setups, limitations, and charts.' }
  ],
  'chemistry': [
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Writing clear methods, documenting reactions, and presenting data.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Interpreting figures, tables, and supplementary lab documentation.' }
  ],
  'biology': [
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Organizing biology experimental papers and presenting results.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Decoding biological figures, controls, and hypothesis testing.' }
  ],
  'medicine': [
    { title: 'What Is Research Methodology? Full Step-by-Step Tutorial', youtubeId: 'nJza2kfI8GU', duration: '20 min', category: 'Medicine', summary: 'Clinical study designs, trials, controls, and ethical concerns.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Reading medical literature, clinical outcomes, and limitations.' }
  ],
  'psychology': [
    { title: 'Research Methodology 101: Simple Explainer', youtubeId: 'TEqYnV6KWfY', duration: '15 min', category: 'APA', summary: 'Qualitative and quantitative psychological research methodology.' },
    { title: 'How To NOT Wreck Your Research Methodology', youtubeId: 'Ap-Ymw_eALE', duration: '12 min', category: 'Methodology', summary: 'Constructing robust participant surveys and behavioral studies.' }
  ],
  'economics': [
    { title: 'Research Methodology 101: Simple Explainer', youtubeId: 'TEqYnV6KWfY', duration: '15 min', category: 'Economics', summary: 'Empirical research designs, datasets, and qualitative analyses.' },
    { title: 'What Is Research Methodology? Full Step-by-Step Tutorial', youtubeId: 'nJza2kfI8GU', duration: '20 min', category: 'Stats', summary: 'Data sampling, modeling, and validating economic theories.' }
  ],
  'history': [
    { title: 'How To NOT Wreck Your Research Methodology', youtubeId: 'Ap-Ymw_eALE', duration: '12 min', category: 'History', summary: 'Qualitative analysis, archival sourcing, and secondary text checks.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Analyzing source context, author biases, and structural claims.' }
  ],
  'literature': [
    { title: 'How To NOT Wreck Your Research Methodology', youtubeId: 'Ap-Ymw_eALE', duration: '12 min', category: 'Literature', summary: 'Formulating critical thesis structures and qualitative inquiries.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Deconstructing qualitative papers and literature syntheses.' }
  ],
  'engineering': [
    { title: 'EGU WEBINARS: How to write a research paper', youtubeId: 'JPZCDTB_mSk', duration: '10 min', category: 'Engineering', summary: 'IEEE styling, layout, structure, and peer-review preparation.' },
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Research', summary: 'Iterative prototyping, modeling, and documenting engineering methods.' }
  ],
  'sociology': [
    { title: 'How To NOT Wreck Your Research Methodology', youtubeId: 'Ap-Ymw_eALE', duration: '12 min', category: 'Sociology', summary: 'Surveys, interviews, ethnographic analysis, and data triangulation.' },
    { title: 'What Is Research Methodology? Full Step-by-Step Tutorial', youtubeId: 'nJza2kfI8GU', duration: '20 min', category: 'Methodology', summary: 'Triangulation, participant sampling, and mixed-method designs.' }
  ],
  'philosophy': [
    { title: 'How To NOT Wreck Your Research Methodology', youtubeId: 'Ap-Ymw_eALE', duration: '12 min', category: 'Philosophy', summary: 'Structuring logical arguments, critical analysis, and thesis drafting.' },
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Decoding abstract logical frameworks and premise evaluation.' }
  ]
};

// Dynamic Helper to extract videos based on field query
const getInterestVideos = (field) => {
  if (!field) {
    return INTEREST_VIDEOS_MAP['computer science'];
  }
  const f = field.toLowerCase().trim();
  for (const key of Object.keys(INTEREST_VIDEOS_MAP)) {
    if (f.includes(key) || key.includes(f)) {
      return INTEREST_VIDEOS_MAP[key];
    }
  }
  // Try split words matching
  const words = f.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      for (const key of Object.keys(INTEREST_VIDEOS_MAP)) {
        if (key.includes(word)) {
          return INTEREST_VIDEOS_MAP[key];
        }
      }
    }
  }
  // Standard Fallback videos
  return [
    { title: 'How to Read a Scientific Paper (Uncommon but Practical Advice)', youtubeId: 'zC5xPVrzTfk', duration: '14 min', category: 'Reading', summary: 'Analyzing publications, evaluating arguments, and capturing data.' },
    { title: 'How to Write a Full Research Paper in 24 Hours', youtubeId: 'YdpFu6Fkr58', duration: '22 min', category: 'Writing', summary: 'Practical layouts, drafting, and reference managers.' }
  ];
};

// Helper to filter articles to ensure unique authors where possible
const getUniqueAuthorArticles = (articles, count = 3) => {
  if (!articles || !Array.isArray(articles)) return [];
  const seenAuthors = new Set();
  const unique = [];
  for (const item of articles) {
    const authorId = item.user?.username || item.user?.name || item.organization?.slug || `anon_${item.id}`;
    if (!seenAuthors.has(authorId)) {
      seenAuthors.add(authorId);
      unique.push(item);
      if (unique.length === count) break;
    }
  }
  // If we have fewer than count unique author articles, fill up with the rest of the articles
  if (unique.length < count) {
    for (const item of articles) {
      if (!unique.find(u => u.id === item.id)) {
        unique.push(item);
        if (unique.length === count) break;
      }
    }
  }
  return unique;
};

// Helper to parse Dev.to articles list into standard format
const parseDevtoArticles = (data) => {
  const uniqueArticles = getUniqueAuthorArticles(data);
  return uniqueArticles.map(item => ({
    id: item.id,
    title: item.title,
    author: item.user?.name || 'Researcher',
    authorAvatar: item.user?.profile_image_90 || '',
    date: item.readable_publish_date || 'May 2026',
    readTime: `${item.reading_time_minutes || 6} min read`,
    summary: item.description || 'Academic research insights and field notes.',
    contentUrl: item.url
  }));
};


function LearningHub() {
  const { userProfile } = useProjects();
  const [activeInterestField, setActiveInterestField] = useState('Computer Science');
  
  // Modal States
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogDetailContent, setBlogDetailContent] = useState('');
  const [loadingBlogDetail, setLoadingBlogDetail] = useState(false);

  // Video and Blogs Dynamic API State
  const [videoMeta, setVideoMeta] = useState({});
  const [generalBlogs, setGeneralBlogs] = useState(realBlogsCache.slice(0, 3));
  const [interestBlogs, setInterestBlogs] = useState([]);
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(true);
  const [failedImages, setFailedImages] = useState({});

  // Sync active interest field when user profile's field changes
  useEffect(() => {
    if (userProfile?.field) {
      const fieldLower = userProfile.field.toLowerCase().trim();
      let matchedField = '';
      for (const key of Object.keys(INTEREST_VIDEOS_MAP)) {
        if (fieldLower.includes(key) || key.includes(fieldLower)) {
          matchedField = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          break;
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveInterestField(matchedField || userProfile.field);
    }
  }, [userProfile?.field]);

  // Fetch YouTube Metadata for loaded videos to display correct title/creator info
  useEffect(() => {
    const uniqueIds = new Set();
    GENERAL_VIDEOS.forEach(v => uniqueIds.add(v.youtubeId));
    Object.values(INTEREST_VIDEOS_MAP).forEach(list => {
      list.forEach(v => uniqueIds.add(v.youtubeId));
    });

    Array.from(uniqueIds).forEach(id => {
      const cached = localStorage.getItem(`yt_meta_${id}`);
      if (cached) {
        try {
          setVideoMeta(prev => ({ ...prev, [id]: JSON.parse(cached) }));
          return;
        } catch (err) {
          console.warn('Failed to parse cached video metadata:', err);
        }
      }

      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          const meta = {
            title: data.title || null,
            author: data.author_name || null,
            thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          };
          localStorage.setItem(`yt_meta_${id}`, JSON.stringify(meta));
          setVideoMeta(prev => ({ ...prev, [id]: meta }));
        })
        .catch(() => {
          // No-op, fallback handled locally
        });
    });
  }, []);

  // Fetch general blogs dynamically from Dev.to API
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingGeneral(true);
    // 3 Specific high-quality academic guide IDs:
    // 1. LaTeX formatting / Writing guide (ID: 3504697)
    // 2. Literature synthesis / Topic guide (ID: 3708331)
    // 3. Thesis bibliography / Study guide (ID: 3591777)
    const targetIds = [3504697, 3708331, 3591777];

    Promise.all(
      targetIds.map(id =>
        fetch(`https://dev.to/api/articles/${id}`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
          })
          .then(item => ({
            id: item.id,
            title: item.title,
            author: item.user?.name || 'Academic Writer',
            authorAvatar: item.user?.profile_image_90 || '',
            date: item.readable_publish_date || 'May 2026',
            readTime: `${item.reading_time_minutes || 5} min read`,
            summary: item.description || 'Standard academic writing guide and tips.',
            content: item.body_markdown || item.description || '',
            contentUrl: item.url,
            tags: item.tags || item.tag_list || []
          }))
      )
    )
      .then(fetchedArticles => {
        if (fetchedArticles && fetchedArticles.length === targetIds.length) {
          setGeneralBlogs(fetchedArticles);
        }
        setLoadingGeneral(false);
      })
      .catch(err => {
        console.warn('Dev.to API general blogs sync failed (e.g. rate limit/offline), keeping cached articles:', err);
        setLoadingGeneral(false);
      });
  }, []);

  // Fetch interest-specific blogs dynamically from Dev.to API
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingInterest(true);
    const term = activeInterestField.toLowerCase().trim();
    
    // Determine tags to try based on selected field
    const mappedTags = FIELD_TAGS_MAP[term];
    const tagsToTry = mappedTags ? [...mappedTags] : [term.replace(/\s+/g, '')];
    // Add generic academic fallback tags to the end
    tagsToTry.push('research', 'academia', 'thesis');

    const tryFetchTags = (index) => {
      if (index >= tagsToTry.length) {
        // Ultimate fallback: Use local real blogs cache
        setInterestBlogs(realBlogsCache.slice(2));
        setLoadingInterest(false);
        return;
      }

      const currentTag = tagsToTry[index];
      fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(currentTag)}&per_page=15`)
        .then(res => {
          if (!res.ok) {
            // Throw custom error to identify API status issues (rate limit, server down, etc.)
            throw new Error('API_STATUS_ERROR');
          }
          return res.json();
        })
        .then(data => {
          if (data && Array.isArray(data) && data.length > 0) {
            setInterestBlogs(parseDevtoArticles(data));
            setLoadingInterest(false);
          } else {
            // Request succeeded (status 200), but empty list returned. Safe to try next tag fallback.
            tryFetchTags(index + 1);
          }
        })
        .catch((err) => {
          // If we hit a network failure, rate limit (HTTP 429), or CORS issue, subsequent requests
          // to Dev.to will also fail, so we should immediately abort the loop and fallback to the cache.
          console.warn(`Dev.to API interest fetch failed for tag: ${currentTag}, falling back to cache.`, err);
          setInterestBlogs(realBlogsCache.slice(2));
          setLoadingInterest(false);
        });
    };

    tryFetchTags(0);
  }, [activeInterestField]);



  // Click handler to open blog and fetch dynamic body markdown
  const handleReadBlog = (blog) => {
    setSelectedBlog(blog);
    if (blog.content) {
      setBlogDetailContent(blog.content);
      return;
    }

    setLoadingBlogDetail(true);
    setBlogDetailContent('');
    fetch(`https://dev.to/api/articles/${blog.id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setBlogDetailContent(data.body_markdown || data.description || 'No detailed content available.');
        setLoadingBlogDetail(false);
      })
      .catch(() => {
        setBlogDetailContent(`### Error Loading Full Article
We were unable to load the full article body from the Dev.to API. You can read the original publication directly on their website:
\n[View Original Article on Dev.to](${blog.contentUrl})`);
        setLoadingBlogDetail(false);
      });
  };

  const handleImageError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  // Markdown parser helper for dynamic articles
  const formatBlogContent = (text) => {
    if (!text) return null;
    
    // Remove front matter (YAML) if present
    let cleanText = text.trim();
    if (cleanText.startsWith('---')) {
      const nextDashes = cleanText.indexOf('---', 3);
      if (nextDashes !== -1) {
        cleanText = cleanText.substring(nextDashes + 3).trim();
      }
    }

    // Clean up Dev.to liquid tags before parsing
    // {% youtube ID %} -> Replace with special embed token
    cleanText = cleanText.replace(/\{%\s*youtube\s+([a-zA-Z0-9_-]+)\s*%\}/g, '\n\n[EMBED_YT]$1\n\n');

    // {% link URL %} -> Replace with standard markdown link
    cleanText = cleanText.replace(/\{%\s*link\s+(https?:\/\/[^\s%]+)\s*%\}/g, '[$1]($1)');

    // Strip other unhandled liquid tags
    cleanText = cleanText.replace(/\{%.*?%\}/g, '');

    const lines = cleanText.split(/\r?\n/);
    const blocks = [];
    let currentBlock = [];
    let currentType = null; // 'code', 'ul', 'ol', 'blockquote', 'paragraph'

    const flushBlock = () => {
      if (currentBlock.length > 0) {
        blocks.push({ type: currentType, lines: currentBlock });
        currentBlock = [];
        currentType = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block check
      if (trimmed.startsWith('```')) {
        if (currentType === 'code') {
          // Close code block
          currentBlock.push(line);
          flushBlock();
        } else {
          // Open code block
          flushBlock();
          currentType = 'code';
          currentBlock.push(line);
        }
        continue;
      }

      if (currentType === 'code') {
        currentBlock.push(line);
        continue;
      }

      // Empty line closes paragraph/list/blockquote blocks
      if (trimmed === '') {
        flushBlock();
        continue;
      }

      // Headings (always individual blocks)
      if (trimmed.startsWith('#')) {
        flushBlock();
        blocks.push({ type: 'heading', lines: [line] });
        continue;
      }

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushBlock();
        blocks.push({ type: 'hr', lines: [line] });
        continue;
      }

      // Embed YouTube
      if (trimmed.startsWith('[EMBED_YT]')) {
        flushBlock();
        const ytId = trimmed.substring(10).trim();
        blocks.push({ type: 'embed-yt', ytId });
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('>')) {
        if (currentType !== 'blockquote') {
          flushBlock();
          currentType = 'blockquote';
        }
        currentBlock.push(line);
        continue;
      }

      // Bullet Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ') || trimmed.startsWith('• ')) {
        if (currentType !== 'ul') {
          flushBlock();
          currentType = 'ul';
        }
        currentBlock.push(line);
        continue;
      }

      // Ordered Lists
      if (/^\d+\.\s+/.test(trimmed)) {
        if (currentType !== 'ol') {
          flushBlock();
          currentType = 'ol';
        }
        currentBlock.push(line);
        continue;
      }

      // Regular text / Paragraphs
      if (currentType !== 'paragraph' && currentType !== null) {
        flushBlock();
      }
      currentType = 'paragraph';
      currentBlock.push(line);
    }

    flushBlock();

    // Helper to parse inline styles (bold, italic, code, links)
    const parseInline = (lineText) => {
      // Escape HTML
      let html = lineText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Images: ![[alt]](url)
      html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="reader-inline-img" />');

      // Links: [text](url)
      html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="reader-link">$1</a>');

      // Bold: **text** or __text__
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

      // Italic: *text* or _text_
      html = html.replace(/\*(.*?)\*(?!\*)/g, '<em>$1</em>');
      html = html.replace(/_(.*?)_(?!_)/g, '<em>$1</em>');

      // Inline code: `code`
      html = html.replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');

      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return blocks.map((block, index) => {
      switch (block.type) {
        case 'heading': {
          const trimmed = block.lines[0].trim();
          const match = trimmed.match(/^(#+)\s+(.*)$/);
          if (match) {
            const level = match[1].length;
            const content = match[2];
            if (level === 1) {
              return <h2 key={index} className="reader-heading-1">{parseInline(content)}</h2>;
            } else if (level === 2) {
              return <h3 key={index} className="reader-heading-2">{parseInline(content)}</h3>;
            } else {
              return <h4 key={index} className="reader-heading-3">{parseInline(content)}</h4>;
            }
          }
          return <p key={index} className="reader-paragraph">{parseInline(trimmed)}</p>;
        }

        case 'hr':
          return <hr key={index} className="reader-hr" />;

        case 'embed-yt':
          return (
            <div key={index} className="reader-embed-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${block.ytId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="reader-embed-iframe"
              ></iframe>
            </div>
          );

        case 'code': {
          const codeLines = block.lines;
          // Strip starting and ending backticks
          const cleanCodeLines = codeLines.slice(1, -1);
          return (
            <pre key={index} className="reader-code-block">
              <code>{cleanCodeLines.join('\n')}</code>
            </pre>
          );
        }

        case 'blockquote': {
          const quoteText = block.lines.map(l => l.trim().replace(/^>\s*/, '')).join(' ');
          return <blockquote key={index} className="reader-blockquote">{parseInline(quoteText)}</blockquote>;
        }

        case 'ul':
          return (
            <ul key={index} className="reader-list">
              {block.lines.map((l, idx) => {
                const itemText = l.trim().replace(/^[-*+•]\s+/, '');
                return <li key={idx}>{parseInline(itemText)}</li>;
              })}
            </ul>
          );

        case 'ol':
          return (
            <ol key={index} className="reader-list-ordered">
              {block.lines.map((l, idx) => {
                const itemText = l.trim().replace(/^\d+\.\s+/, '');
                return <li key={idx}>{parseInline(itemText)}</li>;
              })}
            </ol>
          );

        case 'paragraph':
        default: {
          const paraText = block.lines.map(l => l.trim()).join(' ');
          return <p key={index} className="reader-paragraph">{parseInline(paraText)}</p>;
        }
      }
    });
  };

  const interestVideos = getInterestVideos(activeInterestField);
  const isCustomView = userProfile?.field && userProfile.field.toLowerCase().trim() !== activeInterestField.toLowerCase().trim();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Learning Hub</h1>
        <p className="page-subtitle">Resources to level up your research and academic writing skills.</p>
      </div>

      {/* SECTION 1: Video Tutorials (6 Videos, 2 Rows x 3 Columns Grid) */}
      <section className="learning-section">
        <h2 className="section-title">
          <PlayCircle size={22} className="title-icon icon-blue" />
          Video Tutorials
        </h2>
        <p className="section-subtitle-text">Essential video tutorials covering structural writing, referencing styles, and paper analysis.</p>
        
        <div className="learning-grid">
          {GENERAL_VIDEOS.map((video) => {
            const displayTitle = videoMeta[video.youtubeId]?.title || video.title;
            const displayAuthor = videoMeta[video.youtubeId]?.author || "Academy Tutor";
            const thumbnailUrl = videoMeta[video.youtubeId]?.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
            const hasFailed = failedImages[video.youtubeId];

            return (
              <div 
                className="course-card card" 
                key={video.id}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="course-thumbnail">
                  {!hasFailed ? (
                    <img 
                      src={thumbnailUrl} 
                      alt={displayTitle} 
                      className="video-thumb-img" 
                      onError={() => handleImageError(video.youtubeId)}
                    />
                  ) : (
                    <div className={`course-thumbnail-fallback thumb-${video.color}`}>
                      <PlayCircle size={40} color="white" />
                    </div>
                  )}
                  <div className="play-icon-overlay">
                    <PlayCircle size={44} className="play-icon" color="white" />
                  </div>
                  {video.popular && (
                    <div className="popular-badge">
                      <Star size={11} fill="currentColor" /> Popular
                    </div>
                  )}
                  <span className="video-duration-badge">{video.duration}</span>
                </div>
                <div className="course-content">
                  <span className={`course-category text-${video.color}`}>
                    {video.category}
                  </span>
                  <h3 className="course-title">{displayTitle}</h3>
                  <p className="course-author-meta">By {displayAuthor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Guiding Your Research Journey (Dynamic Blogs API) */}
      <section className="learning-section">
        <h2 className="section-title">
          <BookOpen size={22} className="title-icon icon-purple" />
          Guiding Your Research Journey
        </h2>
        <p className="section-subtitle-text">Learn how to write a paper, formulate your target topic, and study related works.</p>
        
        {loadingGeneral ? (
          <div className="hub-loading-container">
            <div className="hub-spinner"></div>
            <p>Fetching standard articles...</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {generalBlogs.map((blog) => (
              <div 
                className="blog-card card" 
                key={blog.id}
                onClick={() => handleReadBlog(blog)}
              >
                <div className="blog-header-badge">Research Article</div>
                <div className="blog-card-body">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-summary">{blog.summary}</p>
                  <div className="blog-card-footer">
                    <span className="blog-author">
                      {blog.authorAvatar ? (
                        <img src={blog.authorAvatar} alt={blog.author} className="blog-author-img" />
                      ) : (
                        <User size={13} />
                      )}
                      {blog.author}
                    </span>
                    <span className="blog-readtime"><Clock size={13} /> {blog.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: Learn Your Interest (Personalization Feed "as per field of study") */}
      <section className="learning-section interest-section card">
        <div className="interest-header">
          <div className="interest-title-container">
            <Sparkles className="interest-spark-icon" size={24} />
            <div>
              <h2 className="section-title">Learn Your Interest</h2>
              {userProfile?.field ? (
                <p className="interest-subtitle">
                  Tailored recommendations for <strong className="highlight-text">"{userProfile.field}"</strong>
                  {isCustomView && ` (currently viewing ${activeInterestField})`}
                </p>
              ) : (
                <p className="interest-subtitle">Select your field of study below to personalize your learning feed.</p>
              )}
            </div>
          </div>

          <div className="interest-selector-wrapper">
            <label htmlFor="field-selector">Field of Study:</label>
            <select
              id="field-selector"
              className="interest-select"
              value={activeInterestField}
              onChange={(e) => setActiveInterestField(e.target.value)}
            >
              {activeInterestField && !STANDARD_FIELDS.some(f => f.toLowerCase() === activeInterestField.toLowerCase()) && (
                <option value={activeInterestField}>{activeInterestField}</option>
              )}
              {userProfile?.field && 
               userProfile.field.toLowerCase() !== activeInterestField.toLowerCase() && 
               !STANDARD_FIELDS.some(f => f.toLowerCase() === userProfile.field.toLowerCase()) && (
                <option value={userProfile.field}>{userProfile.field} (My Field)</option>
              )}
              <option value="Computer Science">Computer Science & AI</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Statistics">Statistics</option>
              <option value="Physics">Physics & Quantum</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Medicine">Medicine & Clinical</option>
              <option value="Psychology">Psychology</option>
              <option value="Economics">Economics</option>
              <option value="History">History & Archives</option>
              <option value="Literature">Literature</option>
              <option value="Engineering">Engineering</option>
              <option value="Sociology">Sociology</option>
              <option value="Philosophy">Philosophy</option>
            </select>
          </div>
        </div>

        <div className="interest-content-grid">
          {/* Personalized Blogs from API */}
          <div className="interest-blogs-container">
            <h3 className="sub-section-title"><BookOpen size={16} /> Curated Articles</h3>
            {loadingInterest ? (
              <div className="hub-loading-container-small">
                <div className="hub-spinner-small"></div>
                <p>Loading articles for your interest...</p>
              </div>
            ) : interestBlogs.length === 0 ? (
              <p className="no-data-text">No articles found. Try selecting another field of study.</p>
            ) : (
              <div className="blogs-vertical-list">
                {interestBlogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    className="blog-row-card"
                    onClick={() => handleReadBlog(blog)}
                  >
                    <div className="blog-row-content">
                      <span className="blog-row-badge">Interest Pick</span>
                      <h4 className="blog-row-title">{blog.title}</h4>
                      <p className="blog-row-summary">{blog.summary}</p>
                      <div className="blog-row-meta">
                        <span>
                          {blog.authorAvatar ? (
                            <img src={blog.authorAvatar} alt={blog.author} className="blog-author-img-small" />
                          ) : (
                            <User size={12} />
                          )}
                          {blog.author}
                        </span>
                        <span><Clock size={12} /> {blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Videos (Mapped Dynamic List) */}
          <div className="interest-videos-container">
            <h3 className="sub-section-title"><PlayCircle size={16} /> Recommended Videos</h3>
            <div className="videos-compact-grid">
              {interestVideos.map((video) => {
                const displayTitle = videoMeta[video.youtubeId]?.title || video.title;
                const thumbnailUrl = videoMeta[video.youtubeId]?.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                const hasFailed = failedImages[video.youtubeId];

                return (
                  <div 
                    key={video.youtubeId} 
                    className="video-compact-card"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="video-compact-thumb">
                      {!hasFailed ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={displayTitle} 
                          className="video-compact-thumb-img" 
                          onError={() => handleImageError(video.youtubeId)}
                        />
                      ) : (
                        <div className={`video-compact-thumb-fallback thumb-blue`}>
                          <PlayCircle size={20} color="white" />
                        </div>
                      )}
                      <div className="video-compact-overlay">
                        <PlayCircle size={24} color="white" className="play-icon" />
                      </div>
                      <span className="video-compact-duration">{video.duration}</span>
                    </div>
                    <div className="video-compact-info">
                      <h4 className="video-compact-title">{displayTitle}</h4>
                      <p className="video-compact-desc">{video.summary || "Academic video tutorial covering key concepts."}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: Clickable Video Player Modal (Strict non-restricted iframe) */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-player-card card" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3 className="video-modal-title">{videoMeta[selectedVideo.youtubeId]?.title || selectedVideo.title}</h3>
              <button className="btn-close" onClick={() => setSelectedVideo(null)} aria-label="Close video player">
                <X size={20} />
              </button>
            </div>
            
            <div className="video-iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-modal-footer-info">
              <div className="video-meta-tags">
                <span className="meta-badge"><Clock size={12} /> {selectedVideo.duration}</span>
                <span className="meta-badge">YouTube Tutorial</span>
              </div>
              <p className="video-desc-detail">{videoMeta[selectedVideo.youtubeId]?.author ? `By ${videoMeta[selectedVideo.youtubeId].author}` : selectedVideo.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full-text Blog Reader Modal (Dynamic Content Rendering) */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={() => {
          setSelectedBlog(null);
          setBlogDetailContent('');
        }}>
          <div className="blog-reader-card card" onClick={(e) => e.stopPropagation()}>
            <div className="blog-reader-header">
              <div className="blog-reader-meta-top">
                <span className="category-tag">Research Guide</span>
                <button className="btn-close" onClick={() => {
                  setSelectedBlog(null);
                  setBlogDetailContent('');
                }} aria-label="Close article reader">
                  <X size={20} />
                </button>
              </div>
              <h2 className="blog-reader-title">{selectedBlog.title}</h2>
              <div className="blog-reader-author-bar">
                <div className="author-info">
                  {selectedBlog.authorAvatar ? (
                    <img src={selectedBlog.authorAvatar} alt={selectedBlog.author} className="author-avatar-img" />
                  ) : (
                    <div className="author-avatar">
                      {selectedBlog.author.split(' ').pop().charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="author-name">{selectedBlog.author}</span>
                    <span className="pub-date"><Calendar size={12} /> Published {selectedBlog.date}</span>
                  </div>
                </div>
                <span className="read-badge"><Clock size={12} /> {selectedBlog.readTime}</span>
              </div>
            </div>

            <div className="blog-reader-body">
              {loadingBlogDetail ? (
                <div className="reader-loading-spinner">
                  <div className="hub-spinner"></div>
                  <p>Fetching full-text content from API...</p>
                </div>
              ) : (
                formatBlogContent(blogDetailContent)
              )}
            </div>

            <div className="blog-reader-footer">
              <button className="btn-primary" onClick={() => {
                setSelectedBlog(null);
                setBlogDetailContent('');
              }}>
                Finished Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningHub;
