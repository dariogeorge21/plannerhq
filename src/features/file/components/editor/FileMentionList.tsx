import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FileIcon, Loader2, Image, FileText, FileSpreadsheet } from 'lucide-react';

interface FileMentionListProps {
  items: any[];
  command: (item: any) => void;
  isLoading?: boolean;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image className="w-4 h-4" />;
  if (mimeType.startsWith("text/")) return <FileText className="w-4 h-4" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") return <FileSpreadsheet className="w-4 h-4" />;
  return <FileIcon className="w-4 h-4" />;
};

export const FileMentionList = forwardRef((props: FileMentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.file_name, storage_path: item.storage_path });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (props.isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden w-64 p-4 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden w-64 max-h-80 overflow-y-auto">
      {props.items.length ? (
        <div className="p-1">
          {props.items.map((item, index) => (
            <button
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors
                ${index === selectedIndex ? 'bg-violet-50 text-violet-900' : 'text-neutral-700 hover:bg-neutral-50'}
              `}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className={`p-1 rounded-md ${index === selectedIndex ? 'bg-violet-100 text-violet-600' : 'bg-neutral-100 text-neutral-500'}`}>
                {getFileIcon(item.mime_type)}
              </div>
              <span className="truncate font-medium">{item.file_name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-sm text-neutral-500 text-center">
          No files found
        </div>
      )}
    </div>
  );
});

FileMentionList.displayName = 'FileMentionList';
