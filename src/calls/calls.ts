import axios, { AxiosResponse } from "axios";
import dotenv from "react-dotenv";
import { LoginDto, LogoutDto, RegisterDto } from "../../shared-types/dto/auth";
import {
  RepositoryCreateDto,
  RepositoryDeleteDto,
  RepositoryGetDto,
  RepositoryListDto,
} from "../../shared-types/dto/repository";
import {
  FileDeleteDto,
  FileGetDto,
  FileUpdateDto,
} from "../../shared-types/dto/file";
import {
  GroupAddUsersDto,
  GroupCreateDto,
  GroupDeleteDto,
  GroupGetDto,
  GroupListDto,
  GroupRemoveUsersDto,
  GroupUpdateDto,
} from "../../shared-types/dto/group";
import { UserListDto } from "../../shared-types/dto/user";

import TokenHelper from "../helpers/token-helper";

const axiosClient = axios.create({
  baseURL: dotenv.BASE_URI,
  withCredentials: true,
});

axiosClient.interceptors.response.use((response: AxiosResponse) => {
  if (response.headers.authorization) {
    const tokenHelper = new TokenHelper();
    tokenHelper.setToken(response.headers.authorization.split(" ")[1]);
  }

  return response;
});

const Calls = {
  auth: {
    register: (dto: RegisterDto) => {
      return axiosClient.post("auth/register", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    login: (dto: LoginDto) => {
      return axiosClient.post("auth/login", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    logout: (dto: LogoutDto) => {
      return axiosClient.post("auth/logout", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    isAuthorized: (authorizationHeader: string) => {
      return axiosClient.get("auth/isAuthorized", {
        headers: {
          Authorization: authorizationHeader,
        },
      });
    },
  },
  repository: {
    list: (dto: RepositoryListDto) => {
      return axiosClient.get("repository/list", {
        params: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    create: (dto: RepositoryCreateDto) => {
      return axiosClient.post("repository/create", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    delete: (dto: RepositoryDeleteDto) => {
      return axiosClient.delete("repository/delete", {
        data: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    get: (dto: RepositoryGetDto) => {
      return axiosClient.get("repository/get", {
        params: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
  },
  file: {
    get: (dto: FileGetDto) => {
      return axiosClient.get("file/get", {
        params: dto,
        responseType: dto.isPreview === "true" ? "arraybuffer" : "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    update: (dto: FileUpdateDto) => {
      return axiosClient.patch("file/update", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    create: (dto: FormData) => {
      return axiosClient.postForm("file/create", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    delete: (dto: FileDeleteDto) => {
      return axiosClient.delete("file/delete", {
        data: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
  },
  group: {
    create: (dto: GroupCreateDto) => {
      return axiosClient.post("group/create", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    delete: (dto: GroupDeleteDto) => {
      return axiosClient.delete("group/delete", {
        data: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    update: (dto: GroupUpdateDto) => {
      return axiosClient.patch("group/update", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    list: (dto: GroupListDto) => {
      return axiosClient.get("group/list", {
        params: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    addUsers: (dto: GroupAddUsersDto) => {
      return axiosClient.post("group/addUsers", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    get: (dto: GroupGetDto) => {
      return axiosClient.get("group/get", {
        params: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    removeUsers: (dto: GroupRemoveUsersDto) => {
      return axiosClient.patch("group/removeUsers", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
  },
  user: {
    list: (dto: UserListDto) => {
      return axiosClient.get("user/list", {
        params: dto,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    castToRole: (dto: UserListDto) => {
      return axiosClient.patch("user/castToRole", dto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
  },
};

export default Calls;
