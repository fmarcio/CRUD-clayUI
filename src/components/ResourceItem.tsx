import React from "react";
import {
  isComment,
  isPost,
  isTodo,
  type ApiResourceItem,
} from "../utils/utils";
import Comment from "./comments/Comment";
import Todo from "./todos/Todo";
import Post from "./posts/Post";

interface ResourceProps {
  data: ApiResourceItem;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  margin: "10px",
  padding: "15px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const ResourceItem: React.FC<ResourceProps> = ({ data }) => {
  if (isComment(data)) {
    return <Comment item={data} key={data.id} />;
  }

  if (isPost(data)) {
    return <Post item={data} key={data.id} />;
  }

  if (isTodo(data)) {
    return <Todo item={data} key={data.id} />;
  }

  return (
    <div style={{ ...cardStyle, borderColor: "red" }}>
      <p>Unknown resource type for ID: </p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ResourceItem;
