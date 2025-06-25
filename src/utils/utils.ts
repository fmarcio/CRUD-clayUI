export type AlbumResource = {
  userId: number;
  id: number;
  title: string;
};

export type CommentResource = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type PhotoResource = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type PostResource = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type TodoResource = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type UserResource = {
  address: {
    city: string;
    geo: {
      lat: string;
      lng: string;
    };
    street: string;
    suite: string;
    zipcode: string;
  };
  company: { bs: string; catchPrase: string; name: string };
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
  website: string;
};

export type ApiResourceItem =
  | PostResource
  | CommentResource
  | AlbumResource
  | PhotoResource
  | TodoResource
  | UserResource;

export function isAlbum(item: ApiResourceItem): item is AlbumResource {
  return "title" in item && !("body" in item) && !("completed" in item);
}

export function isComment(item: ApiResourceItem): item is CommentResource {
  return "postId" in item && "email" in item;
}

export function isPhoto(item: ApiResourceItem): item is PhotoResource {
  return "albumId" in item && "thumbnailUrl" in item;
}

export function isPost(item: ApiResourceItem): item is PostResource {
  return "body" in item && "title" in item;
}

export function isTodo(item: ApiResourceItem): item is TodoResource {
  return "completed" in item;
}

export function isUser(item: ApiResourceItem): item is UserResource {
  return "username" in item && "email" in item && !("postId" in item);
}
