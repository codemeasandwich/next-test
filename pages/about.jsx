import React from 'react';
import Link from 'next/link';

function AboutPage() {
console.log("AboutPage")
  return (
    <div>
      <h1 id="title" data-testid="title">About Us</h1>
      <p>This is a demo About page for a Next.js application.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
}

export default AboutPage;
