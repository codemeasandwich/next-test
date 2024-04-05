import React from 'react';
import Link from 'next/link'
function HomePage() {

    const [count, setCount] = React.useState(0)
console.log("HomePage")
  return <><h1 id="title" data-testid="title">Hello Medium!</h1>
        <button id="button" data-testid="button" onClick={() => setCount(1)}>
            click me
        </button>
        <span id="count" data-testid="count">{count}</span>

      <Link id="about" data-testid="about" href="/about" style={{display:"none"}}>About</Link>
    </>
}

export default HomePage