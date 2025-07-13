import Card from "@clayui/card";
import React, { useState } from "react";
import { useRequestContext } from "../../hooks/useRequestContext";
import { HTTPMethods } from "../../hooks/useRequest";
import EditTodo from "./EditTodo";
import Button from "@clayui/button";

interface ITodoProps {
  completed: boolean;
  id: number;
  title: string;
}

const Todo: React.FC<ITodoProps> = ({ completed, id, title }) => {
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const { sendRequest } = useRequestContext();

  const handleToggleComplete = async () => {
    await sendRequest({
      body: {
        completed: !completed,
        title,
      },
      id,
      method: HTTPMethods.PATCH,
      resourceName: "todos",
    });
  };

  const handleDelete = async () => {
    await sendRequest({
      id,
      method: HTTPMethods.DELETE,
      resourceName: "todos",
    });
  };

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
          <Button className="m-2" onClick={handleToggleComplete}>
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
          <Button className="m-2" displayType="danger" onClick={handleDelete}>
            {"Delete todo "}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Todo;
