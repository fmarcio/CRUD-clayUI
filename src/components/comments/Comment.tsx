import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import Button from "@clayui/button";
import { Heading } from "@clayui/core";
import { type CommentResource } from "../../utils/utils";
import { useResourcesContext } from "../../hooks/useResourcesContext";
import EditItem from "../EditItem";
import Label, { LabelColors } from "../Label";

interface ICommentProps {
  item: CommentResource;
}

const Comment: React.FC<ICommentProps> = ({ item }) => {
  const { body, email, id, name } = item;

  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const { sendRequest } = useResourcesContext();

  return (
    <Card>
      <Card.Body>
        <Label labelColor={LabelColors.BLUE} labelText="Comment:" />

        <div className="m-3">
          <Heading level={6} weight="semi-bold">
            {body}
          </Heading>
        </div>

        <Label labelColor={LabelColors.GRAY} labelText="Author:" />

        <Card.Description className="m-2" displayType="text" truncate={false}>
          {name}
        </Card.Description>

        <p className="text-italic">{email}</p>

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
                resourceName: "comments",
              })
            }
          >
            {"Delete comment"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Comment;
