import { useMemo, useState } from 'react';

const ADMIN_PASSWORD = 'japanese2026';

const initialBooks = [
  {
    id: 1,
    title: 'Japanese Learning Book 1',
    description: 'A clean starter pack for beginners — kana, core vocabulary, and everyday phrases.',
    size: '20 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-1.svg',
    file: '/books/japanese-learning-book-1.rar'
  },
  {
    id: 2,
    title: 'Japanese Learning Book 2',
    description: 'Grammar foundations, reading rhythm, and practical vocabulary for daily life.',
    size: '22 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-2.svg',
    file: '/books/Japanese2.rar'
  },
  {
    id: 3,
    title: 'Japanese Learning Book 3',
    description: 'Focused lessons on hiragana, katakana, and simple sentence patterns.',
    size: '24 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-3.svg',
    file: '/books/Japanese3.rar'
  },
  {
    id: 4,
    title: 'Japanese Learning Book 4',
    description: 'Useful phrases, listening cues, and cultural context for real conversations.',
    size: '19 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-4.svg',
    file: '/books/Japanese4.rar'
  },
  {
    id: 5,
    title: 'Japanese Learning Book 5',
    description: 'Expanded reading practice and structured study for steady progress.',
    size: '27 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-5.svg',
    file: '/books/Japanese5.rar'
  },
  {
    id: 6,
    title: 'Japanese Learning Book 6',
    description: 'Sentence structure, fluency drills, and confident study habits.',
    size: '26 MB',
    language: 'Japanese / English',
    category: 'Grammar',
    cover: '/covers/japanese-6.svg',
    file: '/books/Japanese6.rar'
  }
];

const categories = ['All', 'Beginner', 'Grammar'];

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [adminKey, setAdminKey] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
      const matchesQuery =
        !normalized ||
        book.title.toLowerCase().includes(normalized) ||
        book.description.toLowerCase().includes(normalized) ||
        book.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [books, query, activeCategory]);

  const triggerDownload = (book) => {
    const filename = `${book.title.replace(/\s+/g, '-').toLowerCase()}.rar`;
    const url = `${book.file}?filename=${encodeURIComponent(filename)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (adminKey === ADMIN_PASSWORD) {
      setAdminOpen(true);
      setAdminKey('');
    } else {
      alert('Wrong password.');
    }
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    const category = form.get('category')?.toString().trim() || 'Beginner';
    const language = form.get('language')?.toString().trim() || 'Japanese / English';
    const size = form.get('size')?.toString().trim() || '—';
    const coverFile = form.get('cover');
    const rarFile = form.get('file');

    if (!title || !description || !coverFile || !rarFile) {
      alert('Please fill all fields and upload both files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBooks((prev) => [
        {
          id: Date.now(),
          title,
          description,
          size,
          language,
          category,
          cover: reader.result,
          file: URL.createObjectURL(rarFile)
        },
        ...prev
      ]);
      event.currentTarget.reset();
      alert('Book added.');
    };
    reader.readAsDataURL(coverFile);
  };

  return (
    <div className="site">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#">
            <span className="brand-mark">書</span>
            <span className="brand-text">
              <strong>BookVault</strong>
              <small>Japanese & English library</small>
            </span>
          </a>
          <nav className="topnav">
            <a href="#collection">Books</a>
            <a href="#admin">Admin</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="kicker">Free study materials</p>
            <h1>Learn Japanese with books you can download instantly.</h1>
            <p className="hero-lede">
              Six curated volumes for beginners and grammar practice. No sign-up — click a cover and start studying.
            </p>
            <div className="hero-stats">
              <div><strong>{books.length}</strong><span>Books</span></div>
              <div><strong>0</strong><span>Sign-up required</span></div>
              <div><strong>RAR</strong><span>Direct download</span></div>
            </div>
          </div>
          <button
            type="button"
            className="hero-featured"
            onClick={() => triggerDownload(books[0])}
            aria-label={`Download ${books[0].title}`}
          >
            <img src={books[0].cover} alt={`${books[0].title} cover`} />
            <div className="hero-featured-label">
              <span>Featured</span>
              <strong>{books[0].title}</strong>
            </div>
          </button>
        </div>
      </section>

      <main className="main">
        <section id="collection" className="collection">
          <div className="collection-head">
            <div>
              <p className="kicker">Collection</p>
              <h2>Pick a volume</h2>
            </div>
            <p className="result-count">
              {filteredBooks.length} of {books.length} books
            </p>
          </div>

          <div className="toolbar">
            <label className="search-field">
              <span className="search-icon" aria-hidden>⌕</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, topic, or level…"
              />
            </label>
            <div className="filter-row" role="tablist" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={activeCategory === category ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="book-grid">
              {filteredBooks.map((book) => (
                <article className="book-card" key={book.id}>
                  <button
                    type="button"
                    className="book-cover-btn"
                    onClick={() => triggerDownload(book)}
                    aria-label={`Download ${book.title}`}
                  >
                    <img src={book.cover} alt="" loading="lazy" />
                  </button>
                  <div className="book-body">
                    <div className="book-meta-row">
                      <span className="book-tag">{book.category}</span>
                      <span className="book-size">{book.size}</span>
                    </div>
                    <h3>{book.title}</h3>
                    <p>{book.description}</p>
                    <p className="book-lang">{book.language}</p>
                    <button type="button" className="btn-download" onClick={() => triggerDownload(book)}>
                      Download
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No books match your search.</p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="highlights">
          {[
            ['Instant access', 'Downloads start the moment you click.'],
            ['Beginner friendly', 'Volumes 1–5 build core skills step by step.'],
            ['Grammar focus', 'Book 6 deepens sentence structure and fluency.']
          ].map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section id="admin" className="admin">
          <div className="admin-head">
            <p className="kicker">Admin</p>
            <h2>Add a new book</h2>
          </div>
          {!adminOpen ? (
            <form onSubmit={handleAdminLogin} className="admin-form">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin password"
                required
              />
              <button className="btn-download" type="submit">Unlock</button>
            </form>
          ) : (
            <form onSubmit={handleAddBook} className="admin-form admin-form-wide">
              <input name="title" placeholder="Book title" required />
              <input name="description" placeholder="Short description" required />
              <input name="category" placeholder="Category" defaultValue="Beginner" />
              <input name="language" placeholder="Language" defaultValue="Japanese / English" />
              <input name="size" placeholder="File size" defaultValue="20 MB" />
              <label>Cover image<input type="file" name="cover" accept="image/*" required /></label>
              <label>RAR file<input type="file" name="file" accept=".rar" required /></label>
              <button className="btn-download" type="submit">Add book</button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>BookVault — Japanese & English learning books, free to download.</p>
      </footer>
    </div>
  );
}
