import React, { useRef, useState } from 'react';
export default function Uploader(params) {
	return (
	<div class='uploader'>
		<div class='uploader-inner'>
			<input type='file' multiple={true} onChange={params.onChange} />
		</div>
	</div>
	)
}