import fs from 'fs';
import path from 'path';

class TestBuilder {
  constructor(steps) {
    this.steps = steps;
  }

  click(action) {
    this.steps.push({ type: 'click', ...action });
    return this;
  }

  check(assertion) {
    this.steps.push({ type: 'check', ...assertion });
    return this;
  }
} // END TestBuilder

/*
export default function (testBuilder) { 
    return testBuilder
                .setup("Increment Button Click")
                .assert({ target: "#count", is:"0" })
                .action({ click: "#button" })
                .assert({ target: "#count", is:"1" })
}
*/
const testCases = []

    const directoryPath = "./use_cases";
  // Read all file names in the current directory
  fs.readdirSync(directoryPath).forEach(file => {
    // Exclude 'index.js' and non-js files
    if (file !== 'index.js' && file.endsWith('.js')) {
      // Require the file and add it to the testFiles array
      const filePath = path.join(directoryPath, file);
      const test = require(`./${file}`).default;
      const steps = [{ 
        type: 'setup', 
        description: file.split('.')[0]
                         .replace(/([A-Z])/g, ' $1') 
                         .toLowerCase()
                         .replace(/^./, match => match.toUpperCase())
    }];
      test(new TestBuilder(steps));
    /*
      if(!steps[0]){
        console.error(`Missing 'setup' step at Start in ${file}`);
        process.exit(1);
      } else if(steps.some(({type},index)=>index && type === 'setup')){
        console.error(`Duplicate 'setup' step in ${file}`);
        process.exit(1);
      }*/
testCases.push(steps)
/*
      let promiseChain = Promise.resolve();
      let hitAProblem = false;
      
      for (const step of steps) {
          promiseChain = promiseChain.then(() => {
              if(!hitAProblem){
                if(adapter[step.type]){
                    hitAProblem = true;
                    return Promise.reject(new Error('Unknown step type'));
                } else {
                    adapter[step.type](step);
                } // END else
              } // END if !hitAProblem
            });// END promiseChain
        } // END for

        // Handle the final resolution or rejection of the chain
        promiseChain.then(() => {
            console.log('All steps completed successfully');
            adapter.done();
        }).catch(error => {
            console.error('An error occurred:', error.message);
            adapter.done(error);
        });*/
    } // END if
  }); // END fs.readdirSync
//console.log(testCases)
export default testCases
