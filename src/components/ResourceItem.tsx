import React from "react";
import {
  isAlbum,
  isComment,
  isPhoto,
  isPost,
  isTodo,
  isUser,
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
  if (isPost(data)) {
    return <Post item={data} key={data.id} />;
  }

  if (isComment(data)) {
    return <Comment item={data} key={data.id} />;
  }

  if (isAlbum(data)) {
    return (
      <div style={cardStyle}>
        <h3>
          Album: {data.title} (ID: {data.id})
        </h3>
        <small>User ID: {data.userId}</small>
      </div>
    );
  }

  if (isPhoto(data)) {
    return (
      <div style={{ ...cardStyle, textAlign: "center" }}>
        <h5>
          Photo: {data.title} (ID: {data.id})
        </h5>
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          style={{
            maxWidth: "100px",
            maxHeight: "100px",
            display: "block",
            margin: "10px auto",
          }}
        />
        <p>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            View full size
          </a>
        </p>
        <small>Album ID: {data.albumId}</small>
      </div>
    );
  }

  if (isTodo(data)) {
    return <Todo item={data} key={data.id} />;
  }

  if (isUser(data)) {
    return (
      <div style={cardStyle}>
        <h3>
          User: {data.name} (@{data.username}) (ID: {data.id})
        </h3>
        <p>Email: {data.email}</p>
        <p>
          Website:{" "}
          <a href={data.website} target="_blank" rel="noopener noreferrer">
            {data.website}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div style={{ ...cardStyle, borderColor: "red" }}>
      <p>Unknown resource type for ID: </p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ResourceItem;
