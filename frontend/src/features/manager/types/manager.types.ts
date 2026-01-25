import type { StoredFile } from "../../../types/file.types";

export type ManagerResponse = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  imageUrl?: StoredFile;
  suspended: boolean;
}

export type ManagerSearchParams = {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
};