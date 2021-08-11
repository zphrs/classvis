import React, {useRef} from 'react';
function DeletableP(params)
{
	const delBtn = useRef();
	const timeout = useRef(null);
	function deleteMe()
	{
		if (!timeout.current)
		{
			timeout.current = window.setTimeout((()=>{
				params.deleteFunct(params.text)
			}), 500)
			delBtn.current.classList.toggle('delete', true)
		}
	}
	return (
		<button className='deleteable-p' ref={delBtn} onClick={deleteMe}>
			<p>{params.text}</p>
			<div className='delete-btn'>delete</div>
		</button>
	)
}
export default DeletableP;