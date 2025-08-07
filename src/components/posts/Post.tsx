import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import Button from "@clayui/button";
import { Heading } from "@clayui/core";
import { useRequestContext } from "../../hooks/useRequestContext";

interface IPostProps {
  body: string;
  id: number;
  title: string;
  userId: number;
}

// TODO: finish POST component by adding edit options

const Post: React.FC<IPostProps> = ({ body, id, title, userId }) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const { sendRequest } = useRequestContext();

  return (
    <Card>
      <Card.Body>
        <Heading level={3} weight="semi-bold">
          {title}
        </Heading>

        <Card.Description displayType="text" truncate={false}>
          {body}
        </Card.Description>

        <p className="text-italic">{`User ID: ${userId}`}</p>

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
      </Card.Body>
    </Card>
  );
};

export default Post;
