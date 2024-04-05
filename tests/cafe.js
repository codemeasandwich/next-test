import { screen } from '@testing-library/testcafe';
import { Selector, ClientFunction } from 'testcafe';
import testCases from '../use_cases/index';

fixture`Dynamic Test Suite`
    .page`http://localhost:3001/`;

testCases.forEach(testCase => {
    const [{ description }, ...steps] = testCase;
    test(description, async t => {
        for (const step of steps) {
            switch (step.type) {
                case 'check':
                    if(step.url){
                        const getWindowLocation = await ClientFunction(() => window.location.pathname)();
                        //t.eval(() => window.location)
                        await t.expect(getWindowLocation).contains(step.url);
                        //await t.expect(stringify(t.testRun.test,{depth:2})).contains(step.url);
                        continue;
                    }
                    const element = Selector(step.target);
                    if(step.is){
                        await t.expect(element.innerText).eql(step.is);
                    } else if(step.has){
                        await t.expect(element.innerText).contains(step.has);
                    }/* else if(step.attribute){
                        await t.expect(element.getAttribute(step.attribute)).eql(step.value);
                    } else if(step.hasClass){
                        await t.expect(element.hasClass(step.className)).ok();
                    } else if(step.notHasClass){
                        await t.expect(element.hasClass(step.className)).notOk();
                    } else if(step.style){
                        await t.expect(element.getStyleProperty(step.propertyName)).eql(step.value);
                    } else if(step.count){
                        await t.expect(element.count).eql(step.value);
                    } else if(step.visible){
                        await t.expect(element.visible).ok();
                    } else if(step.inVisible){
                        await t.expect(element.visible).notOk();
                    }*/ else {
                        throw new Error(`Unsupported assert type: ${step.assertType}`);
                    }
                    break;
                case 'click':
                    // Note: TestCafe's click action inherently includes mouseDown, mouseUp, and focus
                    let elem = Selector(step.target);
                    if(step.is){
                        elem = elem.withText(step.is)
                    } else if(step.has){

                       // elem = await Selector("a").filter(link => link.textContent.includes(step.has))[0];

                        elem =  await Selector(({target,has})=>{
                            //console.log(target,has)
                           // return document.querySelectorAll("#title")[0];

                            const allLinks = document.querySelectorAll(target);
                            //console.log(allLinks)

                            // Filter 'a' tags that contain the text "and something"
                            const filteredLink = Array.from(allLinks).find(link => link.textContent.includes(has));
                           /* console.count(filteredLink)
                            filteredLink.style.background = "red"
                            setInterval(()=>{
                                filteredLink.style.background = filteredLink.style.background === "red" ? "blue":"red"
                            },1000)*/
                            return filteredLink
                        })(step);
                        //await t.expect(stringify(elem,{depth:2})).eql(step.is);

                        //elem = elem.withText(new RegExp(`.*${step.has}.*`))
                        //await t.expect(elem).eql(step.is);
                    }
                    await t.click(elem);
                break;/*
                case 'mouseOver':
                    await t.hover(Selector(step[action]));
                break;
                case 'mouseDown':
                    await t.mouseDown(Selector(step[action]));
                break;
                case 'focus':
                    await t.focus(Selector(step[action]));
                break;
                case 'mouseUp':
                    await t.mouseUp(Selector(step[action]));
                break;
                case 'typeText':
                    await t.typeText(Selector(step[action]), step.text); // Assuming step.text exists and is relevant here
                break;
                case 'pressKey':
                    await t.pressKey(step[action]);
                break;*/
            }
        }
    });
});
















function getOwnEnumPropSymbols (object) {
	return Object
    .getOwnPropertySymbols(object)
    .filter((keySymbol) => Object.prototype.propertyIsEnumerable.call(object, keySymbol));
}

function isRegexp(value) {
	return toString.call(value) === '[object RegExp]';
}

function isObject(value) {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
}

function getObjName(val){
  if(val.constructor
  && "Object" !== val.constructor.name){
    return val.constructor.name + " "
  }
  return ""
} // END getObjName

function stringify(input, options, pad) {
	const seen = [];
//console.log(input)
	return (function stringify(input, options = {}, pad = '',name="") {
		const indent = options.indent || '\t';
    		const currentDepth = options.depth ? pad.split(indent).length : null
		let tokens;
		if (options.inlineCharacterLimit === undefined) {
			tokens = {
				newline: '\n',
				newlineOrSpace: '\n',
				pad,
				indent: pad + indent,
			};
		} else {
			tokens = {
				newline: '@@__STRINGIFY_OBJECT_NEW_LINE__@@',
				newlineOrSpace: '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@',
				pad: '@@__STRINGIFY_OBJECT_PAD__@@',
				indent: '@@__STRINGIFY_OBJECT_INDENT__@@',
			};
		}

		const expandWhiteSpace = (string, reGenArrayWithIndexs) => {
			if (options.inlineCharacterLimit === undefined) {
				return string;
			}

			const oneLined = string
				.replace(new RegExp(tokens.newline, 'g'), '')
				.replace(new RegExp(tokens.newlineOrSpace, 'g'), ' ')
				.replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');

			if (oneLined.length <= options.inlineCharacterLimit) {
				return oneLined;
			}

			return (reGenArrayWithIndexs ? reGenArrayWithIndexs() : string)
				.replace(new RegExp(tokens.newline + '|' + tokens.newlineOrSpace, 'g'), '\n')
				.replace(new RegExp(tokens.pad, 'g'), pad)
				.replace(new RegExp(tokens.indent, 'g'), pad + indent);
		}; // END expandWhiteSpace

		if (seen.includes(input)) {
			if (Array.isArray(input)) {
                return '[ ...! ]';
            }
			return `{ ...${getObjName(input)||"!"} }`;
		}

		if (
			input === null
			|| input === undefined
			|| typeof input === 'number'
			|| typeof input === 'boolean'
		//	|| typeof input === 'function'
			|| typeof input === 'symbol'
			|| isRegexp(input)
		) {
			return String(input);
		}
		if("function" === typeof input){
			const [start]   = input.toString().split(")");
			const isArrow   = ! start.includes("function")
			const [nameA,argsB] = start.replace("function",'')
									 .replace(/ /g,'')
									 .split("(")

			  let realName = name

			  if(isArrow){
				if(realName !=input.name)
				  realName = input.name
				else
				  realName = ""
			  } else {
				if(realName === input.name)
				  realName = "ƒ"
				else
				  realName = input.name
			  }

			  return `${realName}(${argsB})${
				isArrow?"=>":""
			  }{-}`
		  }
		if (input instanceof Error) {
			return `${input.name}("${input.message}")`
		}
		if (input instanceof Date) {
			return `Date(${input.toJSON()})`;
		}
		if( Buffer.isBuffer(input)){
			return `Buffer[ ${Array.from(input).join()} ]`;
		}

		if (Array.isArray(input)
		|| input instanceof Set) {

      let typeOfObj = ""
      if(input instanceof Set){
				typeOfObj = "Set"
				input = Array.from(input.values())
      }

			if (input.length === 0) {
				return typeOfObj+'[ ]';
			}
		    if(currentDepth > options.depth){
			return typeOfObj+'[ + ]';
		      }
			seen.push(input);

			const doWork = (addIndexs)=>{
				return `${typeOfObj}[ ` + tokens.newline + input.map((element, i) => {
					const eol = input.length - 1 === i ?       tokens.newline
													   : ',' + tokens.newlineOrSpace;

					let value = stringify(element, options, pad + indent);
					if (options.transform) {
						value = options.transform(input, i, value);
					}

					return tokens.indent + (addIndexs ? i+":" : "")+value + eol;
				}).join('') + tokens.pad + (tokens.pad.includes(" ") ? "" : " ") +']';
			}

			const returnValue = doWork()
			seen.pop();

			return expandWhiteSpace(returnValue,()=>doWork(true));
		}

		if (isObject(input)) {
			let objectKeys = [], getVal = (key)=>input[key], typeOfObj = getObjName(input)
		  if(input instanceof Map){
				getVal = (key)=>input.get(key)
				objectKeys = Array.from(input.keys())
				typeOfObj = "Map"
		  } else {
				//typeOfObj = getObjName(input)
				objectKeys = [
				 ...Object.keys(input),
				 ...getOwnEnumPropSymbols(input),
			       ];
				 if("Promise" === typeOfObj.trim()){
					 ["then","catch","finally"].forEach( key => {
					 	if("function" === typeof input[key]){
							objectKeys.push(key)
						}
					 })
	      }
			}

			if (options.filter) {
				// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
				objectKeys = objectKeys.filter(element => options.filter(input, element));
			}

			if (objectKeys.length === 0) {
				return typeOfObj+'{ }';
			}
			   if(currentDepth > options.depth){
				return typeOfObj+'{ + }';
			      }
			seen.push(input);

			const returnValue = `${typeOfObj}{ ` + tokens.newline + objectKeys.map((element, i) => {
				const eol = objectKeys.length - 1 === i ? tokens.newline : ',' + tokens.newlineOrSpace;
				const isSymbol = typeof element === 'symbol';
				const isClassic = !isSymbol && /^[a-z$_][$\w]*$/i.test(element);
				const key = isSymbol || isClassic ? element : stringify(element, options);

				let value = stringify(getVal(element), options, pad + indent,key);
				if (options.transform) {
					value = options.transform(input, element, value);
				}

				return tokens.indent + String(key) + ':' + value + eol;
			}).join('') + tokens.pad + (tokens.pad.includes(" ") ? "" : " ") +'}';

			seen.pop();

			return expandWhiteSpace(returnValue);
		}

		input = input.replace(/\\/g, '\\\\');
		input = String(input).replace(/[\r\n]/g, x => x === '\n' ? '\\n' : '\\r');

		if (options.singleQuotes === false) {
			input = input.replace(/"/g, '\\"');
			return `"${input}"`;
		}

		input = input.replace(/'/g, '\\\'');
		return `'${input}'`;
	})(input, options, pad);
}