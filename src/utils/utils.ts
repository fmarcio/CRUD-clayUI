export type CommentResource = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type PostResource = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Resource = {
  id: number;
  name: string;
};

export type ResourceGroup = {
  name: string;
  resources: Resource[];
};

export type TodoResource = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type ApiResourceItem = CommentResource | PostResource | TodoResource;

export const resourcesNames: ResourceGroup[] = [
  {
    name: "Resources",
    resources: [
      { id: 2, name: "comments" },
      { id: 1, name: "posts" },
      { id: 5, name: "todos" },
    ],
  },
];

export const areInputsValid = ({
  resourceName,
  itemBody,
  itemTitle,
}: {
  resourceName: string;
  itemBody: string;
  itemTitle: string;
}): boolean => {
  if (resourceName === "todos") {
    return !!itemTitle;
  }

  if (resourceName === "posts" || resourceName === "comments") {
    return !!itemTitle && !!itemBody;
  }

  return true;
};

export function isComment(item: ApiResourceItem): item is CommentResource {
  return "postId" in item && "email" in item;
}

export function isPost(item: ApiResourceItem): item is PostResource {
  return "body" in item && "title" in item;
}

export function isTodo(item: ApiResourceItem): item is TodoResource {
  return "completed" in item;
}
