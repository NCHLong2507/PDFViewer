export interface Document {
    _id: string,
    owner: {name:string, email: string,picture:string},
    name: string,
    fileUrl: string,
    updatedAt: string,
}

