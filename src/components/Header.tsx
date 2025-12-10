import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/">
            <a className={styles.logo}>VegakTools</a>
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/tools">
                <a>Tools</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;