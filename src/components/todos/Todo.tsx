import Card from "@clayui/card";
import React, { useState } from "react";
import { HTTPMethods } from "../../hooks/useRequest";
import Button from "@clayui/button";
import { useResourcesContext } from "../../hooks/useResourcesContext";
import EditItem from "../EditItem";
import { type TodoResource } from "../../utils/utils";
import ItemModal from "../ItemModal";
interface ITodoProps {
  item: TodoResource;
}

const Todo: React.FC<ITodoProps> = ({ item }) => {
  const { completed, id, title } = item;
  const { sendRequest } = useResourcesContext();

  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
            onClick={() => setIsModalOpen(true)}
          >
            {"Delete todo"}
          </Button>
        )}

        {isModalOpen && (
          <ItemModal
            isOpen={isModalOpen}
            modalText="Are you sure you want to delete this todo?"
            modalTitle="Delete Todo"
            onClose={() => setIsModalOpen(false)}
            sendRequest={() =>
              sendRequest({
                id,
                method: HTTPMethods.DELETE,
                resourceName: "todos",
              })
            }
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default Todo;
