// import React, { useRef } from 'react'
// import '@toast-ui/editor/dist/toastui-editor.css';

// import { Editor } from '@toast-ui/react-editor';
// import { Copy } from 'lucide-react';

// interface PROPS{
//   aiOutput:string;
// }
// const OutputSection = ({aiOutput}:PROPS) => {
//   const editorRef:any=useRef();


 

//   return (
//     <div className='bg-white shadow-lg border '> 
//     <div className='flex justify-between items-center p-5'><h2>Your result</h2>
//     <button><Copy/></button></div>
//       <Editor
//       // ref={editorRef}
//     initialValue="Your result will appear here"
    
//     height="600px"
//     initialEditType="wysiwyg"
//     useCommandShortcut={true}

//   /></div>
//   )
// }

// export default OutputSection

import React, { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Copy } from 'lucide-react';

interface PROPS {
  aiOutput: string;
}

const OutputSection = ({ aiOutput }: PROPS) => {
  // Specify the type as React.MutableRefObject<Editor | null>
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(aiOutput); // Update the editor's markdown content
    }
  }, [aiOutput]);

  return (
    <div className="bg-white shadow-lg border">
      <div className="flex justify-between items-center p-5">
        <h2>Your result</h2>

        <button onClick={()=>navigator.clipboard.writeText(aiOutput)}>
          <Copy />
        </button>
      </div>
      <Editor
        ref={editorRef} // Attach the ref properly
        initialValue="Your result will appear here"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
      />
    </div>
  );
};

export default OutputSection;
