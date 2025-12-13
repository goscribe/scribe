import { RouterOutputs } from "@goscribe/server";

type FileAsset = RouterOutputs['workspace']['list']['workspaces'][number];
type FolderInfo = RouterOutputs['workspace']['list']['folders'][number];

export interface FileItem {
    id: string;
    name: string;
    type: "file" | "folder";
    lastModified: string;
    size?: string;
    isStarred?: boolean;
    sharedWith?: string[];
    icon?: string;
    color?: string;
  }
  
export interface FolderItem {
    id: string;
    name: string;
    lastModified: string;
    color?: string;
  }

  export const transformFileInformation = (file: FileAsset): FileItem => {
    return {
        id: file.id,
        name: file.title || "Untitled File",
        type: "file" as const,
        lastModified: file.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : "Unknown",
        size: "Unknown",
        isStarred: false,
        sharedWith: [],
        icon: file.icon,    
        color: file.color,
    }
  }

  export const transformFolderInformation = (folder: FolderInfo): FolderItem => {
    return {
        id: folder.id,
        name: folder.name || "Untitled Folder",
        lastModified: folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : "Unknown",
        color: folder.color,
    }
  }