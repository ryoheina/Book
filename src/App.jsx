import { useMemo, useState } from 'react';
import { initialBooks, getBookText, getDownloadName } from './data/books';
import { ui, categoryKeys, getCategoryLabel } from './i18n/ui';

const ADMIN_PASSWORD = 'japanese2026';

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [uiLocale, setUiLocale] = useState('en');
  const [activeLibrary, setActiveLibrary] = useState('ja');
  const [adminKey, setAdminKey] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const t = ui[uiLocale];

  const libraryBooks = useMemo(
    () => books.filter((book) => book.lang === activeLibrary),
    [books, activeLibrary]
  );

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return libraryBooks.filter((book) => {
      const text = getBookText(book);
      const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
      const matchesQuery =
        !normalized ||
        text.title.toLowerCase().includes(normalized) ||
        text.description.toLowerCase().includes(normalized) ||
        getCategoryLabel(book.category, uiLocale).toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [libraryBooks, query, activeCategory, uiLocale]);

  const featuredBook = libraryBooks[0];

  const triggerDownload = (book) => {
    const filename = getDownloadName(book);
    const url = `${book.file}?filename=${encodeURIComponent(filename)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const switchLibrary = (library) => {
    setActiveLibrary(library);
    setActiveCategory('all');
    setQuery('');
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (adminKey === ADMIN_PASSWORD) {
      setAdminOpen(true);
      setAdminKey('');
    } else {
      alert(t.adminWrongPassword);
    }
  };

  const handleAddBook = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    const category = form.get('category')?.toString().trim() || 'beginner';
    const lang = form.get('lang')?.toString().trim() === 'en' ? 'en' : 'ja';
    const size = form.get('size')?.toString().trim() || '—';
    const coverFile = form.get('cover');
    const rarFile = form.get('file');

    if (!title || !description || !coverFile || !rarFile) {
      alert(t.adminFillFields);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const id = `${lang}-${Date.now()}`;
      setBooks((prev) => [
        {
          id,
          lang,
          category,
          size,
          cover: reader.result,
          file: URL.createObjectURL(rarFile),
          text: {
            [lang]: { title, description },
            [lang === 'ja' ? 'en' : 'ja']: { title, description }
          }
        },
        ...prev
      ]);
      event.currentTarget.reset();
      alert(t.adminAdded);
    };
    reader.readAsDataURL(coverFile);
  };

  const featuredText = featuredBook ? getBookText(featuredBook) : null;

  return (
    <div className="site" lang={uiLocale}>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#">
            <span className="brand-mark">{activeLibrary === 'ja' ? '書' : 'A'}</span>
            <span className="brand-text">
              <strong>{t.brandName}</strong>
              <small>{t.brandTagline}</small>
            </span>
          </a>
          <nav className="topnav">
            <a href="#collection">{t.navBooks}</a>
            <a href="#admin">{t.navAdmin}</a>
            <button
              type="button"
              className="lang-toggle"
              onClick={() => setUiLocale((prev) => (prev === 'en' ? 'ja' : 'en'))}
            >
              {t.langToggle}
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="kicker">{t.heroKicker}</p>
            <h1>{activeLibrary === 'ja' ? t.heroTitleJa : t.heroTitleEn}</h1>
            <p className="hero-lede">
              {activeLibrary === 'ja' ? t.heroLedeJa : t.heroLedeEn}
            </p>
            <div className="hero-stats">
              <div><strong>{libraryBooks.length}</strong><span>{t.statBooks}</span></div>
              <div><strong>0</strong><span>{t.statSignup}</span></div>
              <div><strong>RAR</strong><span>{t.statFormat}</span></div>
            </div>
          </div>
          {featuredBook && (
            <button
              type="button"
              className="hero-featured"
              onClick={() => triggerDownload(featuredBook)}
              aria-label={t.downloadAria(featuredText.title)}
            >
              <img src={featuredBook.cover} alt="" />
              <div className="hero-featured-label">
                <span>{t.featured}</span>
                <strong>{featuredText.title}</strong>
              </div>
            </button>
          )}
        </div>
      </section>

      <main className="main">
        <section id="collection" className="collection">
          <div className="collection-head">
            <div>
              <p className="kicker">{t.collectionKicker}</p>
              <h2>{t.collectionTitle}</h2>
            </div>
            <p className="result-count">
              {t.resultCount(filteredBooks.length, libraryBooks.length)}
            </p>
          </div>

          <div className="library-switch" role="tablist" aria-label="Book library">
            <button
              type="button"
              role="tab"
              aria-selected={activeLibrary === 'ja'}
              className={activeLibrary === 'ja' ? 'library-tab active' : 'library-tab'}
              onClick={() => switchLibrary('ja')}
            >
              <span className="library-tab-icon">書</span>
              {t.sectionJapanese}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeLibrary === 'en'}
              className={activeLibrary === 'en' ? 'library-tab active' : 'library-tab'}
              onClick={() => switchLibrary('en')}
            >
              <span className="library-tab-icon">A</span>
              {t.sectionEnglish}
            </button>
          </div>

          <div className="toolbar">
            <label className="search-field">
              <span className="search-icon" aria-hidden>⌕</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
              />
            </label>
            <div className="filter-row" role="tablist" aria-label="Filter by category">
              {categoryKeys.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={activeCategory === category ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setActiveCategory(category)}
                >
                  {getCategoryLabel(category, uiLocale)}
                </button>
              ))}
            </div>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="book-grid">
              {filteredBooks.map((book) => {
                const text = getBookText(book);
                return (
                  <article className="book-card" key={book.id} data-lang={book.lang}>
                    <button
                      type="button"
                      className="book-cover-btn"
                      onClick={() => triggerDownload(book)}
                      aria-label={t.downloadAria(text.title)}
                    >
                      <img src={book.cover} alt="" loading="lazy" />
                    </button>
                    <div className="book-body">
                      <div className="book-meta-row">
                        <span className="book-tag">{getCategoryLabel(book.category, book.lang)}</span>
                        <span className="book-size">{book.size}</span>
                      </div>
                      <h3>{text.title}</h3>
                      <p>{text.description}</p>
                      <p className="book-lang">
                        {book.lang === 'ja' ? '日本語' : 'English'}
                      </p>
                      <button type="button" className="btn-download" onClick={() => triggerDownload(book)}>
                        {t.download}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>{t.emptyState}</p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
              >
                {t.clearFilters}
              </button>
            </div>
          )}
        </section>

        <section className="highlights">
          <article>
            <h3>{t.highlight1Title}</h3>
            <p>{t.highlight1Text}</p>
          </article>
          <article>
            <h3>{activeLibrary === 'ja' ? t.highlight2TitleJa : t.highlight2TitleEn}</h3>
            <p>{activeLibrary === 'ja' ? t.highlight2TextJa : t.highlight2TextEn}</p>
          </article>
          <article>
            <h3>{t.highlight3Title}</h3>
            <p>{activeLibrary === 'ja' ? t.highlight3TextJa : t.highlight3TextEn}</p>
          </article>
        </section>

        <section id="admin" className="admin">
          <div className="admin-head">
            <p className="kicker">{t.adminKicker}</p>
            <h2>{t.adminTitle}</h2>
          </div>
          {!adminOpen ? (
            <form onSubmit={handleAdminLogin} className="admin-form">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder={t.adminPassword}
                required
              />
              <button className="btn-download" type="submit">{t.adminUnlock}</button>
            </form>
          ) : (
            <form onSubmit={handleAddBook} className="admin-form admin-form-wide">
              <select name="lang" defaultValue={activeLibrary}>
                <option value="ja">日本語 / Japanese</option>
                <option value="en">英語 / English</option>
              </select>
              <input name="title" placeholder={t.adminBookTitle} required />
              <input name="description" placeholder={t.adminDescription} required />
              <input name="category" placeholder={t.adminCategory} defaultValue="beginner" />
              <input name="size" placeholder={t.adminSize} defaultValue="20 MB" />
              <label>{t.adminCover}<input type="file" name="cover" accept="image/*" required /></label>
              <label>{t.adminFile}<input type="file" name="file" accept=".rar" required /></label>
              <button className="btn-download" type="submit">{t.adminAdd}</button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
