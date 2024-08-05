import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy, FiCheck } from "react-icons/fi";
import { Toaster, toast } from 'sonner'

const CopyToClipboardComponent = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.info('Text copied to clipboard!')

    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <div className="flex items-stretch mt-1">
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <button>{copied ? <FiCheck size={15} /> : <FiCopy size={15} />}</button>
      </CopyToClipboard>
      <Toaster position="bottom-right" duration={1000}/>

    </div>
  );
};

export default CopyToClipboardComponent;
