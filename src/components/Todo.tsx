import Button from "@clayui/button";
import Card from "@clayui/card";
import React, { useState } from "react";

interface ITodoProps {
  completed: boolean;
  id: number;
  onDelete: (id: number) => void;
  title: string;
}

const Todo: React.FC<ITodoProps> = ({ completed, id, title, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onDelete(id);
      }
    } catch (error) {
      console.error(`Failed to delete todo: ${error}`);
    }
  };

  const [isCompleted, setIsCompleted] = useState<boolean>(completed);

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

        <Button displayType="secondary" onClick={handleDelete}>
          {"Delete todo"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Todo;
