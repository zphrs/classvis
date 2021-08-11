import React, { useState, useEffect, useRef } from 'react';
import DeletableP from './DeletableP';

function ClassBox(props) {
	const [myChildren, setMyChildren] = useState([]);
	const childNameInput = useRef();
	const settings = useRef();
	const classVarDiv = useRef();
	const expandAllBtn = useRef();
	const expandSettingsBtn = useRef();
	const expandClassVars = useRef();
	const expandClassFuncts = useRef();
	const expandSubclasses = useRef();
	const subBtns = [expandSettingsBtn, expandClassVars, expandClassFuncts, expandSubclasses];
	const newFunctForm = useRef();
	const newVarForm = useRef();
	const classHolder = useRef();
	const classFunctDiv = useRef();
	const containsAll = useRef();
	const collapsableElems = [settings, classVarDiv, classHolder, classFunctDiv, containsAll]
	const previewClassName = useRef();
	const parentsChildList = useRef(props.parentsChildList);
	const name = useRef(props.name??'');
	const parentName = useRef(props.parent??'');
	const myLocation = useRef(props.location);
	const [classVars, setClassVars] = useState(new Set());
	const [classFuncts, setClassFuncts] = useState(new Set());
	parentsChildList.current = props.parentsChildList;
	myLocation.current = props.location;
	console.log(myLocation.current);
	useEffect(() => {
		parentsChildList.current.push({name:name.current, parentName:parentName.current, children:myChildren, classVars:new Set(), classFuncts:new Set()}); // eslint-disable-next-line
	}, []);
	function plaintextToClassName(text)
	{
		let out = text.replace(/[\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
		if (out.length === 0)
		{
			return '';
		}
		out = out[0].toUpperCase()+out.slice(1);
		return out;
	}
	function addChild()
	{
		if (verifyClassNameInput(true))
		{
			const newClassName = previewClassName.current.innerHTML;
			setMyChildren([...myChildren, {name: newClassName, parent:name.current}]);
			props.setListOfClassNames(new Set(props.listOfClassNames).add(newClassName));
			childNameInput.current.value = ''; // clears input
			childNameInput.current.style.backgroundColor = '';
			previewClassName.current.innerHTML = '';
		}
		else
		{
			childNameInput.current.style.backgroundColor = 'lightcoral';
		}
	}
	function addClassVar()
	{
		if (verifyVariableInput(newVarForm, true))
		{
			const [select, varType, varName, preview] = newVarForm.current.children;
			const newVar = preview.innerHTML;
			varType.value = '';
			varName.value = '';
			varType.style.backgroundColor = '';
			varName.style.backgroundColor = '';
			preview.innerHTML = '';
			select.selectedIndex = 0;
			setClassVars(new Set(classVars).add(newVar));
			parentsChildList.current[myLocation.current].classVars.add(newVar);
		}
	}
	function verifyFunctInput(fromBtn)
	{
		fromBtn = fromBtn === true;
		const out = verifyVariableInput(newFunctForm, fromBtn);
		newFunctForm.current.children[3].innerHTML+='()'
		return out;
	}
	function addClassFunct()
	{
		if (verifyFunctInput(newFunctForm, true))
		{
			console.log('HERE');
			const [select, returnType, functName, preview] = newFunctForm.current.children;
			const newFunct = preview.innerHTML;
			setClassFuncts(new Set(classFuncts).add(newFunct));
			parentsChildList.current[myLocation.current].classFuncts.add(newFunct);
			preview.innerHTML = '';
			returnType.value = '';
			functName.value = '';
			returnType.style.backgroundColor = '';
			functName.style.backgroundColor = '';
			select.selectedIndex = 0;
		}
	}
	function checkJavaString(str) {
		if (str.endsWith('[]'))
		{
			str = str.substring(0, str.length-2)
			console.log(str);
		}
		return !!str.match(/^[A-Za-z_$][a-zA-Z0-9 _$]*$/i);
	}
	function checkJavaIdentifier(str) // to check class, function, and variable names
	{
		return (checkJavaString(str)?
			!str.match(/(?<!.)(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while|true|false)(?!.)/)
			:false)?!props.listOfClassNames.has(str):false;
	}
	function verifyClassNameInput(fromBtn)
	{
		fromBtn = fromBtn === true;
		if (childNameInput.current.value.length === 0)
		{
			childNameInput.current.style.backgroundColor = fromBtn?'lightcoral':'';
			previewClassName.current.innerHTML = '';
			return false;
		}
		const converted = plaintextToClassName(childNameInput.current.value);
		if (checkJavaIdentifier(converted))
		{
			childNameInput.current.style.backgroundColor = 'lightgreen';
			previewClassName.current.innerHTML = converted;
			return true;
		}
		else
		{
			childNameInput.current.style.backgroundColor = 'lightcoral';
			return false;
		}
	}
	function verifyVariableInput(ref, fromBtn)
	{
		fromBtn = fromBtn === true;
		const [select, varType, varName, preview] = ref.current.children
		let valid = true;
		if (varType.value.length === 0 )
		{
			varType.style.backgroundColor = fromBtn?'lightcoral':'';
			preview.innerHTML = select.value;
			valid = false;
		}
		else if (checkJavaString(varType.value))
		{
			varType.style.backgroundColor = 'lightgreen';
			preview.innerHTML = select.value + ' ' + varType.value;
		}
		else
		{
			varType.style.backgroundColor = 'lightcoral';
			valid = false;
		}
		const varNames = varName.value.split(', ');
		if (varName.value.length === 0)
		{
			varName.style.backgroundColor = fromBtn?'lightcoral':'';
			valid = false;
		}
		else if (varNames.length === 1?checkJavaIdentifier(varNames[0]):varNames.reduce((runningVal, curVarName)=>{
			if (typeof runningVal == 'string')
			{
				runningVal = checkJavaIdentifier(runningVal);
			}
			return runningVal?checkJavaIdentifier(curVarName):false;
		}))
		{
			varName.style.backgroundColor = 'lightgreen';
			if (preview.innerHTML !== select.value)
			{
				preview.innerHTML += ' ' + varName.value;
			}
			return valid;
		}
		else
		{
			varName.style.backgroundColor = 'lightcoral';
			valid = false;
		}
		return valid;
	}
	function collapseAll(force)
	{
		force = expandAllBtn.current?.classList.toggle('hide', force)??force;
		collapsableElems.forEach(elem=>elem.current?.classList.toggle('hide', force));
		subBtns.forEach(e=>
			{
				e.current?.classList.toggle('hide', force);
			});
		makeAllUntabbable(containsAll.current, force);
	}
	function collapseSettings(force)
	{
		force = expandSettingsBtn.current.classList.toggle('hide', force);
		settings.current.classList.toggle('hide', force);
		makeAllUntabbable(settings.current, force);
	}
	function collapseClassVars(force)
	{
		force = expandClassVars.current.classList.toggle('hide', force);
		classVarDiv.current.classList.toggle('hide', force);
		makeAllUntabbable(classVarDiv.current, force);
	}
	function collapseClassFuncts(force)
	{
		force = expandClassFuncts.current.classList.toggle('hide', force);
		classFunctDiv.current.classList.toggle('hide', force);
		makeAllUntabbable(classFunctDiv.current, force);
	}
	function collapseSubclasses(force)
	{
		force = expandSubclasses.current.classList.toggle('hide', force);
		classHolder.current.classList.toggle('hide', force);
		makeAllUntabbable(classHolder.current, force);
	}
	function makeAllUntabbable(divElem, force, recursive)
	{
		if (recursive)
		{
			if (force)
			{
				divElem.tabIndex = -1;
			}
			else
			{
				divElem.removeAttribute('tabindex');
				if (divElem.classList.contains('hide'))
				{
					return;
				}
			}
			[...divElem.children].forEach(e=>makeAllUntabbable(e, force, true));
		}
		else // needed because otherwise the classlist won't update before loop is done, making some elems permanently untabbable
		{
			if (!force)
			{
				window.setTimeout(()=>{
					makeAllUntabbable(divElem, force, true)
				}, 0)
			}
			else
			{
				makeAllUntabbable(divElem, force, true);
			}
		}
	}
	let countdown = null;
	function deleteMe(event)
	{
		console.log('deleting at ind ' + myLocation.current)
		countdown = window.setTimeout(()=>{
			window.removeEventListener('pointerdown', cancelDelete);
			const myDict = parentsChildList.current.splice(myLocation.current, 1)[0];
			console.log(myDict);
			props.delMyself(myLocation.current);
			const classNameCpy = new Set(props.listOfClassNames);
			function handleMyChildren(listOfChildren)
			{
				listOfChildren.forEach(e=>{
					classNameCpy.delete(e.name);
					handleMyChildren(e.children);
				})
			}
			classNameCpy.delete(name.current);
			handleMyChildren(myDict.children);
			props.setListOfClassNames(classNameCpy);

		}, 1000)
		function cancelDelete()
		{
			window.removeEventListener('pointerdown', cancelDelete);
			window.clearTimeout(countdown);
			event.target.parentNode.classList.toggle('delete', false);
			countdown = null;
		}
		window.addEventListener('pointerdown', cancelDelete);
		event.target.parentNode.classList.toggle('delete', true);
	}
	return (
		<div className={props.depth%2===0?'classbox':'classbox invert'}>
			{name.current && (<>
					<h1 className='inline-block-header'>{name.current}</h1>
					<button ref={expandAllBtn} className='collapsable-btn' onClick={()=>collapseAll()}>{'>'}</button>
				</>
				)
			}
			<div ref={containsAll} className='contains-all'>
				<h3 className='inline-block-header'>Settings</h3>
				<button ref={expandSettingsBtn} onClick={()=>collapseSettings()} className='collapsable-btn'>{'>'}</button>
				<div ref={settings} className={'settings'}>
					<div className='form new-class'>
						<input onChange={verifyClassNameInput} ref={childNameInput} onKeyUp={(e)=>{if (e.key !== 'Enter') return; e.preventDefault(); e.target.parentElement.querySelector('button').click()}} type='text' placeholder='Class Name'></input>
						<p ref={previewClassName}></p>
						<button onClick={addChild}>{(name.current)?'Add Child Class to '+name.current:'Add Class'}</button>
					</div>
					{name.current && (
						<div ref={newVarForm} className='form new-var'>
							<select id='security-levels'>
								<option value='private' defaultValue>private (-)</option>
								<option value='protected'>protected (#)</option>
								<option value='public'>public (+)</option>
							</select>
							<input onChange={()=>verifyVariableInput(newVarForm)} onKeyUp={(e)=>{if (e.key !== 'Enter') return; e.preventDefault(); e.target.nextSibling.focus()}} type='text' list='classes' placeholder='variable type'></input>
							<input onChange={()=>verifyVariableInput(newVarForm)} onKeyUp={(e)=>{if (e.key !== 'Enter') return; e.preventDefault(); e.target.parentElement.querySelector('button').click()}} type='text' placeholder='variable name'></input>
							<p></p>
							<button onClick={addClassVar}>Add Instance Variable</button>
						</div>
					)}
					{name.current && (
						<div ref={newFunctForm} className='form new-funct'>
							<select>
								<option value='public' defaultValue>public (+)</option>
								<option value='protected'>protected (#)</option>
								<option value='private'>private (-)</option>
							</select>
							<input onChange={verifyFunctInput} onKeyUp={(e)=>{if (e.key !== 'Enter') return; e.preventDefault(); e.target.nextSibling.focus()}} type='text' list='classes' placeholder='return type'></input>
							<input onChange={verifyFunctInput} onKeyUp={(e)=>{if (e.key !== 'Enter') return; e.preventDefault(); e.target.parentElement.querySelector('button').click()}} type='text' placeholder='function name'></input>
							<p></p>
							<button onClick={addClassFunct}>Add Class Function</button>
						</div>
					)}
					{name.current && (
						<button onClick={deleteMe} className='delete-class-btn'>Delete this class, {name.current}</button>
					)}
				</div>
				{classVars.size>0 && (
					<>
						<h3 className='inline-block-header'>Instance Variables</h3>
						<button ref={expandClassVars} onClick={()=>collapseClassVars()} className='collapsable-btn'>{'>'}</button>
						<div ref={classVarDiv} className='class-vars'>
						{[...classVars].map(classVar=><DeletableP key={name.current+classVar} text={classVar} deleteFunct={txt=>{const newClassVars = new Set(classVars); newClassVars.delete(txt); setClassVars(newClassVars); parentsChildList.current[myLocation.current].classVars.delete(txt);}}></DeletableP>)}
						</div>
					</>
					)}
				{classFuncts.size>0 && (
					<>
						<h3 className='inline-block-header'>Class Functions</h3>
						<button ref={expandClassFuncts} onClick={()=>collapseClassFuncts()} className='collapsable-btn'>{'>'}</button>
						<div ref={classFunctDiv} className='class-vars'>
							{[...classFuncts].map(classFunct=><DeletableP key={name.current+classFunct} text={classFunct} deleteFunct={txt=>{const newClassFuncts = new Set(classFuncts); newClassFuncts.delete(txt); setClassFuncts(newClassFuncts); parentsChildList.current[myLocation.current].classFuncts.delete(txt);}}></DeletableP>)}
						</div>
					</>
				)}
				{myChildren.length>0 && (
					<>
					{name.current && (
						<>
						<h3 className='inline-block-header'>Subclasses</h3>
						<button ref={expandSubclasses} className='collapsable-btn' onClick={()=>collapseSubclasses()}>{'>'}</button>
						</>
					)}
					<div ref={classHolder} className='class-holder' style={{maxHeight: `max(calc(100vh - ${props.depth === 0?125:(props.depth)*300}px), 200px)`}}>
						{myChildren.map((e, index)=>
						<ClassBox name={e.name}
						listOfClassNames={props.listOfClassNames}
						setListOfClassNames={props.setListOfClassNames}
						parent={e.parent} 
						depth={props.depth+1} 
						location={index} 
						key={e.name} 
						parentsChildList={parentsChildList.current[myLocation.current].children}
						delMyself={ind=>{const newerChildren = [...myChildren]; newerChildren.splice(ind, 1); console.log(myChildren, newerChildren); setMyChildren(newerChildren)}}
						/>
										)
						}
					</div>
					</>
				)}
			</div>
		</div>
	);
}

export default ClassBox;

