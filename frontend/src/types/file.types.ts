export interface StoredFile {
    id: number;
    filename: string;
    url: string;
    type: 'IMAGE' | 'PDF';
    uploadedAt: string;
}

export interface FileResponse {
    id: number;
    filename: string;
    storedName: string;
    contentType: string;
    type: 'IMAGE' | 'PDF' | 'OTHER';
    url: string;
}