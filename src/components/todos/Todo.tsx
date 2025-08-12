import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import Button from "@clayui/button";
import { useResourcesContext } from "../../hooks/useResourcesContext";
import EditItem from "../EditItem";
import { type TodoResource } from "../../utils/utils";
interface ITodoProps {
  item: TodoResource;
}

const Todo: React.FC<ITodoProps> = ({ item }) => {
  const { completed, id, title } = item;
  const { sendRequest } = useResourcesContext();

  const [isEditActive, setIsEditActive] = useState<boolean>(false);

  const styles: object = completed
    ? { color: "grey", textDecoration: "line-through" }
    : { fontWeight: "bold" };

  return (
    <Card>
      <Card.Body>
        <Card.Description displayType="text" style={styles} truncate={false}>
          {title}
        </Card.Description>

        {!isEditActive && (
          <Button
            className="m-2"
            onClick={() =>
              sendRequest({
                body: {
                  completed: !completed,
                  title,
                },
                id,
                method: HTTPMethods.PATCH,
                resourceName: "todos",
              })
            }
          >
            {completed ? "Set back to incomplete" : "Complete todo"}
          </Button>
        )}

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
                resourceName: "todos",
              })
            }
          >
            {"Delete todo"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Todo;
