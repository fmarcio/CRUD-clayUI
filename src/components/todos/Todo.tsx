import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import EditTodo from "./EditTodo";
import Button from "@clayui/button";
import { useResourcesActionsContext } from "../../hooks/useResourcesActionsContext";
interface ITodoProps {
  completed: boolean;
  id: number;
  title: string;
}

const Todo: React.FC<ITodoProps> = ({ completed, id, title }) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const { handleTodoActions } = useResourcesActionsContext();

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
              handleTodoActions({
                id,
                method: HTTPMethods.PATCH,
                body: {
                  completed: !completed,
                  title,
                },
              })
            }
          >
            {completed ? "Set back to incomplete" : "Complete todo"}
          </Button>
        )}

        <EditTodo
          completed={completed}
          id={id}
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
        />

        {!isEditActive && (
          <Button
            className="m-2"
            displayType="danger"
            onClick={() =>
              handleTodoActions({ id, method: HTTPMethods.DELETE })
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
