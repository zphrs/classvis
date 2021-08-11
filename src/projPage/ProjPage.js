import React, { useRef, useState } from 'react';
import ClassBox from './ClassBox.js'
import Uploader from './Uploader.js'
import './ProjPage.css';
import { v4 as uuidv4 } from 'uuid';
function App() {
  const allChildren = useRef([]);
  const [listOfClassNames, setListOfClassNames] = useState(new Set(['int', 'double', 'boolean', 'float', 'char', 'long', 'short', 'long', 'byte', 'String', 'void']));
  const [showUploader, setShowUploader] = useState(false)
  function exportClasses()
  {
	console.log(JSON.stringify([...allChildren.current], null, 2));
	function downloadTree(dict)
	{
			dict.forEach(childClass=>{
				if (childClass.name !=='') 
					download(childClass.name+'.java', 
`public class ${childClass.name}${childClass.parentName?(' extends ' + childClass.parentName):''} 
{
	${[...childClass.classVars].map(classVar=>(classVar+';')).join('\n\t')}
	public ${childClass.name}() {
		// TODO: fill out constructor
	}

	${[...childClass.classFuncts].map(classFunct=>(classFunct+'\n\t{\n\t\t\n\t}')).join('\n\t')}
}`
					)
				if (childClass.children)
				{
					downloadTree(childClass.children);
				}
			})
	}
	downloadTree(allChildren.current);
  }
  function uploadClassFiles() {
	  setShowUploader(true)
  }
  function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
  
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
  
	document.body.removeChild(element);
  }
  return (
	<>
	<datalist id='classes'>
		{[...listOfClassNames].map(className=><option value={className}></option>)}
	</datalist>
	  <h1>Java Class Generator</h1>
	  <button onClick={exportClasses}>Download Class Files</button>
	  <button onClick={uploadClassFiles}>Upload Class Files</button>
	  <div className='all-classes'>
      	<ClassBox 
		  parentsChildList={allChildren.current} 
		  listOfClassNames={listOfClassNames} 
		  setListOfClassNames={setListOfClassNames} 
		  location={0} 
		  uuidv4={uuidv4}
		  key='base'
		  depth={0}
		/>
		
	  </div>
	</>
  );
}

export default App;
