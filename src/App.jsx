import { useState } from 'react';

const ADMIN_PASSWORD = 'japanese2026';

const initialBooks = [
 {
    id: 1,
    title: 'Japanese Learning Book 1',
    description: 'An introduction to reading rhythm, and practical vocabulary for everyday Japanese.',
    size: '20 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-1.svg',
    file: '/books/japanese-learning-book-1.rar'
  },
  {
    id: 2,
    title: 'Japanese Learning Book 2',
    description: 'Practice grammar, reading rhythm, and practical vocabulary for everyday Japanese.',
    size: '22 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-2.svg',
    file: '/books/Japanese2.rar'
  },
  {
    id: 3,
    title: 'Japanese Learning Book 3',
    description: 'A focused set of lessons for hiragana, katakana, and simple sentence patterns.',
    size: '24 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-3.svg',
    file: '/books/Japanese3.rar'
  },
  {
    id: 4,
    title: 'Japanese Learning Book 4',
    description: 'Build confidence with useful phrases, listening cues, and cultural context.',
    size: '19 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-4.svg',
    file: '/books/Japanese4.rar'
  },
  {
    id: 5,
    title: 'Japanese Learning Book 5',
    description: 'An expanded lesson collection for reading practice and structured Japanese study.',
    size: '27 MB',
    language: 'Japanese / English',
    category: 'Beginner',
    cover: '/covers/japanese-5.svg',
    file: '/books/Japanese5.rar'
  },
  {
    id: 6,
    title: 'Japanese Learning Book 6',
    description: 'A polished final layer for sentence structure, fluency, and confident study habits.',
    size: '26 MB',
    language: 'Japanese / English',
    category: 'Grammar',
    cover: '/covers/japanese-6.svg',
    file: '/books/Japanese6.rar'
  }
];

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [adminKey, setAdminKey] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

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
    <div className="page-shell clean-layout">
      <header className="hero-panel glass-panel">
        <div className="hero-copy-wrap">
          <p className="eyebrow">Japanese And English Books Download</p>
          <h1>Luxury Japanese And English learning, designed for instant access.</h1>
          <p className="lede">A cinematic digital library experience: premium visuals, effortless downloads, and a polished product feel from the first scroll.</p>
          <div className="hero-metrics">
            <div className="metric-card glass-inner"><strong>01</strong><span>Instant download</span></div>
            <div className="metric-card glass-inner"><strong>02</strong><span>No sign-up</span></div>
            <div className="metric-card glass-inner"><strong>03</strong><span>Japanese-first collection</span></div>
          </div>
          <button type="button" className="download-button hero-button" onClick={() => triggerDownload(books[0])}>Download</button>
        </div>

        <div className="hero-visual-wrap">
          <div className="spotlight" />
          <div className="platform-ring" />
          <button type="button" className="floating-cover" onClick={() => triggerDownload(books[0])} aria-label={`Download ${books[0].title}`}>
            <img src={books[0].cover} alt={`${books[0].title} cover`} />
          </button>
        </div>

        <aside className="hero-side glass-inner">
          <p className="eyebrow">Collection</p>
          <h3>Curated Japanese and English learning books</h3>
          <p className="lede">Designed to feel premium, clean, and luxurious from the first impression.</p>
          <a className="button-link" href="#admin">Admin access</a>
        </aside>
      </header>

      <main className="stack">
        <section className="glass-panel search-panel">
          <p className="eyebrow">Search</p>
          <h2>Discover the collection with a refined search experience.</h2>
          <div className="search-shell glass-inner">
            <span>⌕</span>
            <input type="text" placeholder="Search Japanese and English learning books" />
          </div>
        </section>

        <section className="glass-panel collection-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured collection</p>
              <h3>Luxury book showcase</h3>
            </div>
          </div>
          <div className="carousel-row">
            {books.map((book) => (
              <article className="luxury-card glass-inner" key={book.id}>
                <button type="button" className="cover-thumb" onClick={() => triggerDownload(book)} aria-label={`Download ${book.title}`}>
                  <img src={book.cover} alt={`${book.title} cover`} loading="lazy" />
                </button>
                <div className="luxury-card-body">
                  <p className="eyebrow">{book.category}</p>
                  <h4>{book.title}</h4>
                  <p>{book.description}</p>
                  <button type="button" className="download-button" onClick={() => triggerDownload(book)}>Download</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel categories-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Categories</p>
              <h3>Curated by learning path</h3>
            </div>
          </div>
          <div className="category-grid">
            {['Beginner', 'Grammar', 'Kana', 'JLPT', 'Reading', 'Culture'].map((item) => (
              <article className="category-card glass-inner" key={item}><h4>{item}</h4><p>Luxury learning pathways designed for focused study.</p></article>
            ))}
          </div>
        </section>

        <section className="glass-panel trust-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Trust</p>
              <h3>Why visitors trust the experience</h3>
            </div>
          </div>
          <div className="trust-grid">
            {[
              ['Instant Download', 'Download begins immediately with a single click.'],
              ['No Registration', 'No account setup or login required.'],
              ['Fast Access', 'Lightweight files and a clean interface.'],
              ['Secure Files', 'Direct file delivery with a premium feel.']
            ].map(([title, text]) => (
              <article className="trust-card glass-inner" key={title}><h4>{title}</h4><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section id="admin" className="glass-panel admin-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Admin only</p>
              <h3>Add or update Japanese and English learning books</h3>
            </div>
          </div>

          {!adminOpen ? (
            <form onSubmit={handleAdminLogin} className="admin-form">
              <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Enter admin password" required />
              <button className="download-button" type="submit">Unlock admin panel</button>
            </form>
          ) : (
            <form onSubmit={handleAddBook} className="admin-form">
              <input name="title" placeholder="Book title" required />
              <input name="description" placeholder="Short description" required />
              <input name="category" placeholder="Category" defaultValue="Beginner" />
              <input name="language" placeholder="Language" defaultValue="Japanese / English" />
              <input name="size" placeholder="File size" defaultValue="18 MB" />
              <label>Cover image<input type="file" name="cover" accept="image/*" required /></label>
              <label>RAR file<input type="file" name="file" accept=".rar" required /></label>
              <button className="download-button" type="submit">Add book</button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
