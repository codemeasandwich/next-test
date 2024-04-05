import React, { useEffect, useState, useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import testCases from '../use_cases/index';
import App from '../pages/_app';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // Import RouterContext for mocking the router

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../pages');
const routeMap = {};
const prefix = '';

fs.readdirSync(dir, { 
  withFileTypes: true 
}).forEach((dirent) => {
  const filePath = path.join(dir, dirent.name);
  console.log(filePath, `${prefix}/${dirent.name}`)
  if (dirent.isDirectory()) {
    buildRouteMap(filePath, `${prefix}/${dirent.name}`);
  } else if (dirent.name.startsWith('_app.')) {
    // Skip _app.js
  } else if (path.extname(dirent.name) === '.jsx') {
    const route = `${prefix}/${
    dirent.name.startsWith("index.") ? "" :
    path.basename(dirent.name, '.jsx')}`;
    routeMap[route] = require(filePath).default;
  }
});

//=====================================================
//==================================== mock Next Router
//=====================================================

// Mocks Next.js router
function mockNextRouter() {
  let setCurrentUrl = () => {};
  const history = []
  const push = jest.fn((url) => {
    history.push(url);
    setCurrentUrl(url);
    return Promise.resolve(url)
  });
  const replace = jest.fn((url) => {
    history[history.length-1] = url;
    setCurrentUrl(url);
    return Promise.resolve(url)
  });
  const prefetch = jest.fn(() => {
    Promise.resolve()
  });

  const mockRouter = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push,
    replace,
    prefetch,
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }; // END mockRouter
  history.push(mockRouter.pathname)

  return {
    RouterContextProvider: ({ children }) => {
      const [currentUrl, setCurUrl] = useState(mockRouter.pathname)
      setCurrentUrl = setCurUrl

      return <RouterContext.Provider value={mockRouter}>
        <App Component={routeMap[currentUrl]} pageProps={{}} />
        </RouterContext.Provider>
    },
    mockRouter,
    getCurrentUrl: () => {
      return history[history.length-1]
    },
  }; // END return
} // END mockNextRouter

//=====================================================
//=========================================== Top Level
//=====================================================

function TopLevel({getCurrentUrl}){
  return <App Component={routeMap[getCurrentUrl()]} pageProps={{}} />
}

//=====================================================
//========================================= handle Test
//=====================================================

function handleTest(step,getCurrentUrl){
    switch (step.type) {
    case 'check':
      if(step.is || step.has){
        const id = step.target.substring(1);
        const element = screen.getByTestId(id);
        if(step.is){
          expect(element).toHaveTextContent(step.is);
        } else {
          expect(element.textContent).toContain(step.has);
        }
      } else if(step.url){
          expect(getCurrentUrl()).toBe(step.url);
      } else {
        throw new Error(`Unsupported assert type: ${step.assertType}`);
      }
      break;
    case 'click':
      if (step.target) {
        let element;
        if(step.target.startsWith("#")){
          const id = step.target.substring(1);
         element = screen.getByTestId(id);
        } else {
          const lookFor = step.is || new RegExp(`.*${step.has}.*`);
          element = screen.getByText(lookFor,{selector:step.target});
        }
        return fireEvent.click(element);
      }
      break;
  } // END switch
} // END handleTest

//=====================================================
//========================================= Test Runner
//=====================================================

describe('App', () => {

  testCases.forEach((testCase) => {

   const [{ description }, ...steps] = testCase;

    const { 
      RouterContextProvider, 
      mockRouter,
      getCurrentUrl
    } = mockNextRouter();

   test(description, () => {
 
    render( <RouterContextProvider/>)
      let worker = Promise.resolve();
      for (const step of steps) {
        worker = worker.then(()=>handleTest(step,getCurrentUrl))
      } // END for
      return worker;
    }); // END test
  }); // END testCases
}); // END describe
