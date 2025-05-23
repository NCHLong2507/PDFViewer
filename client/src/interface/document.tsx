export interface Document {
    _id: string,
    owner: {name:string, email: string},
    name: string,
    fileUrl: string,
    updatedAt: string,
}

