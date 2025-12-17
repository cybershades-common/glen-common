// ===================================================================================
// GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================
// This script provides comprehensive website search functionality that searches
// through all pages on the Glenaeon website. It includes both header search button
// functionality and footer search input functionality with real-time suggestions.
// The search covers page titles, content, meta descriptions, and navigation items.
// ===================================================================================

(function() {
  'use strict';

  // ===================================================================================
  // CONFIGURATION AND SEARCH DATA
  // ===================================================================================
  
  // Define searchable content across the website
  const searchableContent = [
    {
      title: "Home",
      url: "/",
      description: "Glenaeon Rudolf Steiner School - A place where children flourish",
      keywords: ["home", "main", "school", "education", "steiner", "rudolf", "glenaeon"],
      content: "Welcome to Glenaeon Rudolf Steiner School. We are a vibrant learning community that nurtures the whole child."
    },
    {
      title: "Learning at Glenaeon",
      url: "/learning",
      description: "Discover our unique approach to education",
      keywords: ["learning", "education", "curriculum", "approach", "teaching", "development"],
      content: "Our educational approach is based on Rudolf Steiner's insights into child development, recognizing that children learn differently at different stages."
    },
    {
      title: "Early Childhood (Birth - Age 7)",
      url: "/early-childhood",
      description: "Nurturing young children through play-based learning",
      keywords: ["early", "childhood", "young", "children", "play", "development", "kindergarten"],
      content: "In our early childhood programs, we provide a warm, homelike environment where young children can develop through imitation, rhythm, and creative play."
    },
    {
      title: "Playgroups",
      url: "/playgroups",
      description: "Parent and child programs for the youngest learners",
      keywords: ["playgroups", "toddlers", "parents", "early", "development", "social"],
      content: "Our playgroups offer a gentle introduction to community life for children and parents."
    },
    {
      title: "Preschool",
      url: "/preschool",
      description: "Preparing children for formal learning through creative play",
      keywords: ["preschool", "preparation", "creative", "play", "imagination", "development"],
      content: "Our preschool program honors the developmental needs of young children through storytelling, creative play, and artistic activities."
    },
    {
      title: "Primary School (Kindergarten-Class 6)",
      url: "/primary-school",
      description: "Building strong foundations in academics and character",
      keywords: ["primary", "elementary", "kindergarten", "class", "academics", "foundation"],
      content: "Primary school years focus on developing literacy, numeracy, and critical thinking skills through engaging, hands-on learning."
    },
    {
      title: "High School (Year 7-12)",
      url: "/high-school",
      description: "Preparing students for their future with comprehensive education",
      keywords: ["high", "secondary", "senior", "year", "university", "preparation", "graduation"],
      content: "Our high school program challenges students academically while supporting their personal growth and development."
    },
    {
      title: "Admissions",
      url: "/admissions",
      description: "Join our school community",
      keywords: ["admissions", "enrolment", "application", "join", "community", "process"],
      content: "Learn about our admissions process and how to become part of the Glenaeon community."
    },
    {
      title: "About Us",
      url: "/about",
      description: "Our history, philosophy, and community",
      keywords: ["about", "history", "philosophy", "community", "story", "mission", "values"],
      content: "Discover the history and philosophy behind Glenaeon Rudolf Steiner School."
    },
    {
      title: "News & Events",
      url: "/news",
      description: "Stay updated with school news and upcoming events",
      keywords: ["news", "events", "updates", "announcements", "calendar", "happenings"],
      content: "Keep up to date with the latest news, events, and announcements from our school community."
    },
    {
      title: "Contact Us",
      url: "/contact",
      description: "Get in touch with our school",
      keywords: ["contact", "phone", "email", "address", "location", "touch"],
      content: "Find our contact information and location details to get in touch with us."
    },
    {
      title: "Wellbeing",
      url: "/wellbeing",
      description: "Supporting student mental health and wellbeing",
      keywords: ["wellbeing", "mental", "health", "support", "pastoral", "care"],
      content: "We prioritize student wellbeing through comprehensive pastoral care and support programs."
    },
    {
      title: "Student Stories",
      url: "/student-stories",
      description: "Hear from our current and former students",
      keywords: ["student", "stories", "experiences", "testimonials", "graduates", "alumni"],
      content: "Read inspiring stories from our students about their learning journey and experiences at Glenaeon."
    },
    {
      title: "Outdoor Education",
      url: "/outdoor-education",
      description: "Learning beyond the classroom",
      keywords: ["outdoor", "education", "nature", "adventure", "experiential", "learning"],
      content: "Our outdoor education program connects students with nature and provides hands-on learning experiences."
    },
    {
      title: "Sport",
      url: "/sport",
      description: "Physical development and team building",
      keywords: ["sport", "physical", "education", "teams", "fitness", "health", "games"],
      content: "Our sports program promotes physical development, teamwork, and healthy competition."
    }
  ];

  // ===================================================================================
  // SEARCH FUNCTIONALITY
  // ===================================================================================
  
  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    searchableContent.forEach(item => {
      let score = 0;
      let matchType = '';

      // Check title match (highest priority)
      if (item.title.toLowerCase().includes(searchTerm)) {
        score += 100;
        matchType = 'title';
      }

      // Check keyword match (high priority)
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())
      );
      if (keywordMatch) {
        score += 80;
        if (!matchType) matchType = 'keyword';
      }

      // Check description match (medium priority)
      if (item.description.toLowerCase().includes(searchTerm)) {
        score += 60;
        if (!matchType) matchType = 'description';
      }

      // Check content match (lower priority)
      if (item.content.toLowerCase().includes(searchTerm)) {
        score += 40;
        if (!matchType) matchType = 'content';
      }

      // Add partial matches for better UX
      const words = searchTerm.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          if (item.title.toLowerCase().includes(word)) score += 20;
          if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 15;
          if (item.description.toLowerCase().includes(word)) score += 10;
        }
      });

      if (score > 0) {
        results.push({
          ...item,
          score,
          matchType,
          snippet: generateSnippet(item, searchTerm)
        });
      }
    });

    // Sort by score (highest first) and limit results
    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }

  function generateSnippet(item, searchTerm) {
    const text = item.content || item.description;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index === -1) return item.description;
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    // Highlight search term
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
    
    return snippet;
  }

  // ===================================================================================
  // SEARCH UI COMPONENTS
  // ===================================================================================
  
  function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'glenaeon-search-modal';
    modal.innerHTML = `
      <div class="search-modal-backdrop"></div>
      <div class="search-modal-content">
        <div class="search-modal-header">
          <div class="search-input-container">
            <input type="text" class="search-modal-input" placeholder="Search Glenaeon..." autocomplete="off">
            <button class="search-modal-close" aria-label="Close search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="search-modal-body">
          <div class="search-results"></div>
          <div class="search-no-results" style="display: none;">
            <p>No results found. Try searching for:</p>
            <div class="search-suggestions">
              <button type="button" data-search="learning">Learning</button>
              <button type="button" data-search="admissions">Admissions</button>
              <button type="button" data-search="early childhood">Early Childhood</button>
              <button type="button" data-search="high school">High School</button>
              <button type="button" data-search="contact">Contact</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  function displayResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '';
      document.querySelector('.search-no-results').style.display = 'block';
      return;
    }

    document.querySelector('.search-no-results').style.display = 'none';
    
    container.innerHTML = results.map(result => `
      <div class="search-result-item" data-url="${result.url}">
        <h3 class="search-result-title">${result.title}</h3>
        <p class="search-result-snippet">${result.snippet}</p>
        <span class="search-result-url">${window.location.origin}${result.url}</span>
      </div>
    `).join('');
  }

  // ===================================================================================
  // EVENT HANDLERS AND INITIALIZATION
  // ===================================================================================
  
  function initializeSearch() {
    let searchModal;
    let searchInput;
    let resultsContainer;
    let debounceTimer;

    // Create and append search modal to document
    function createModal() {
      searchModal = createSearchModal();
      document.body.appendChild(searchModal);
      
      searchInput = searchModal.querySelector('.search-modal-input');
      resultsContainer = searchModal.querySelector('.search-results');
      
      // Event listeners for modal
      setupModalEventListeners();
    }

    function setupModalEventListeners() {
      // Close modal events
      const closeButton = searchModal.querySelector('.search-modal-close');
      const backdrop = searchModal.querySelector('.search-modal-backdrop');
      
      closeButton.addEventListener('click', closeModal);
      backdrop.addEventListener('click', closeModal);
      
      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
          closeModal();
        }
      });

      // Search input events
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const results = performSearch(e.target.value);
          displayResults(results, resultsContainer);
        }, 200);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstResult = resultsContainer.querySelector('.search-result-item');
          if (firstResult) {
            window.location.href = firstResult.dataset.url;
          }
        }
      });

      // Result click handlers
      resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
          window.location.href = resultItem.dataset.url;
        }
      });

      // Suggestion clicks
      const suggestions = searchModal.querySelectorAll('[data-search]');
      suggestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const term = e.target.dataset.search;
          searchInput.value = term;
          const results = performSearch(term);
          displayResults(results, resultsContainer);
        });
      });
    }

    function openModal() {
      if (!searchModal) createModal();
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 100);
    }

    function closeModal() {
      if (searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        document.querySelector('.search-no-results').style.display = 'none';
      }
    }

    // Initialize all search triggers
    function initializeSearchTriggers() {
      // Header search buttons
      const headerSearchButtons = document.querySelectorAll('.header-search');
      headerSearchButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
      });

      // Footer search inputs
      const footerSearchInputs = document.querySelectorAll('.mega-menu__footer .form-control');
      footerSearchInputs.forEach(input => {
        input.addEventListener('focus', openModal);
        input.addEventListener('click', openModal);
        
        // Also handle direct typing in footer input
        input.addEventListener('input', (e) => {
          if (!searchModal || !searchModal.classList.contains('active')) {
            openModal();
          }
          if (searchInput && e.target.value) {
            searchInput.value = e.target.value;
            const results = performSearch(e.target.value);
            displayResults(results, resultsContainer);
          }
        });
      });
    }

    // Initialize when DOM is ready
    initializeSearchTriggers();
  }

  // ===================================================================================
  // CSS STYLES FOR SEARCH MODAL
  // ===================================================================================
  
  function addSearchStyles() {
    const styles = `
      .glenaeon-search-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .glenaeon-search-modal.active {
        opacity: 1;
        visibility: visible;
      }

      .search-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }

      .search-modal-content {
        position: relative;
        max-width: 700px;
        margin: 80px auto 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }

      .glenaeon-search-modal.active .search-modal-content {
        transform: translateY(0);
      }

      .search-modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        background: #fafafa;
      }

      .search-input-container {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .search-modal-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s ease;
      }

      .search-modal-input:focus {
        border-color: #db574e;
      }

      .search-modal-close {
        padding: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .search-modal-close:hover {
        background: #eee;
      }

      .search-modal-body {
        max-height: 400px;
        overflow-y: auto;
        padding: 20px;
      }

      .search-result-item {
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border: 1px solid transparent;
      }

      .search-result-item:hover {
        background: #f8f9fa;
        border-color: #db574e;
      }

      .search-result-title {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1c3666;
        line-height: 1.3;
      }

      .search-result-snippet {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #666;
        line-height: 1.4;
      }

      .search-result-snippet mark {
        background: #fff3cd;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 600;
      }

      .search-result-url {
        font-size: 13px;
        color: #999;
        font-family: monospace;
      }

      .search-no-results {
        text-align: center;
        padding: 40px 20px;
      }

      .search-no-results p {
        margin-bottom: 20px;
        color: #666;
        font-size: 16px;
      }

      .search-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }

      .search-suggestions button {
        padding: 8px 16px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .search-suggestions button:hover {
        background: #db574e;
        color: white;
        border-color: #db574e;
      }

      @media (max-width: 768px) {
        .search-modal-content {
          margin: 20px;
          margin-top: 60px;
          max-height: calc(100vh - 80px);
        }
        
        .search-modal-body {
          max-height: calc(100vh - 200px);
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // ===================================================================================
  // INITIALIZE ON DOM READY
  // ===================================================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    addSearchStyles();
    initializeSearch();
  });

})();

// ===================================================================================
// END OF GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================