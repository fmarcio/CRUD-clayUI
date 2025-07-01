import Button from "@clayui/button";
import Card from "@clayui/card";
import React, { useState } from "react";
import { useRequestContext } from "../hooks/useRequestContext";

interface ITodoProps {
  completed: boolean;
  id: number;
  title: string;
}

const Todo: React.FC<ITodoProps> = ({ completed, id, title }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);
  const { sendRequest } = useRequestContext();

  const styles: object = isCompleted
    ? { color: "grey", textDecoration: "line-through" }
    : { fontWeight: "bold" };

  return (
    <Card>
      <Card.Body>
        <Card.Description displayType="text" style={styles} truncate={false}>
          {title}
        </Card.Description>

        {!isCompleted ? (
          <Button
            className="m-2"
            onClick={() => {
              setIsCompleted(true);
            }}
          >
            {"Complete todo"}
          </Button>
        ) : (
          <Button
            className="m-2"
            onClick={() => {
              setIsCompleted(false);
            }}
          >
            {"Set back to incomplete"}
          </Button>
        )}

        <Button
          displayType="secondary"
          onClick={() =>
            sendRequest({
              method: "DELETE",
              resourceName: "todos",
              id,
            })
          }
        >
          {"Delete todo"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Todo;
