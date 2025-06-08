import api from "../api/axios";
import type { Collaborator } from "../interface/collaborator";

const documentDetailService = {
  addAnnotation: (documentID: string, xfdfString: string, annotID: string) => {
    return api.post(`/annotation/add?id=${documentID}`, {
      xfdf: xfdfString,
      annotID,
    });
  },
  updateAnnotation: (
    documentID: string,
    annotWaitingQueue: { [key: string]: string }
  ) => {
    return api.post(`/annotation/updateAnnotation?id=${documentID}`, {
      annotations: annotWaitingQueue,
    });
  },
  setLoadingFirst: (documentID: string) => {
    return api.patch(`/document/setLoadingFirst?id=${documentID}`);
  },
  getAnnotation: (documentID: string) => {
    return api.get(`/annotation/load-xfdf?id=${documentID}`);
  },
  findByEmail: (email: string) => {
    return api.post("/user/find-by-email", { email });
  },
  addAccessControl: (
    documentID: string,
    userAddedList: string[],
    roleAdded: string
  ) => {
    return api.post(`/document/addaccesscontrol?id=${documentID}`, {
      emailList: userAddedList,
      role: roleAdded,
    });
  },
  updateAccessControl: (documentID: string,modified:Collaborator[]) => {
    return api.put(`/document/updateaccesscontrol?id=${documentID}`, modified);
  },
  getDocumentInfor: (documentID: string|null) => {
    return api.get(`/document/documentInfor?id=${documentID}`);
  },
  getActionPermission: (documentID:string|null) => {
    return api.get(`/auth/permission?id=${documentID}`);
  }
};

export default documentDetailService;
