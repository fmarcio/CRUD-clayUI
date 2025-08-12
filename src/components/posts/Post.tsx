import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import Button from "@clayui/button";
import { Heading } from "@clayui/core";
import { type PostResource } from "../../utils/utils";
import { useResourcesContext } from "../../hooks/useResourcesContext";
import EditItem from "../EditItem";

interface IPostProps {
  item: PostResource;
}

const Post: React.FC<IPostProps> = ({ item }) => {
  const { body, id, title, userId } = item;

  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const { sendRequest } = useResourcesContext();

  return (
    <Card>
      <Card.Body>
        <Heading level={3} weight="semi-bold">
          {title}
        </Heading>

        <Card.Description displayType="text" truncate={false}>
          {body}
        </Card.Description>

        <EditItem
          item={item}
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
        />

        {!isEditActive && (
          <Button
            className="m-2"
            displayType="danger"
            onClick={() =>
              sendRequest({
                id,
                method: HTTPMethods.DELETE,
                resourceName: "posts",
              })
            }
          >
            {"Delete post"}
          </Button>
        )}

        <p className="mt-2 text-italic">{`User ID: ${userId}`}</p>
      </Card.Body>
    </Card>
  );
};

export default Post;
