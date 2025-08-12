import Button from "@clayui/button";
import Form, { ClayInput } from "@clayui/form";
import { HTTPMethods } from "../hooks/useRequest";
import { useState } from "react";
import ClayAlert from "@clayui/alert";
import { useResourcesContext } from "../hooks/useResourcesContext";

interface IAddTodoInputProps {
  alert: boolean;
  setAlert: (alert: boolean) => void;
  resourceName: string;
}

const ItemInput: React.FC<IAddTodoInputProps> = ({
  alert,
  resourceName,
  setAlert,
}) => {
  const [itemBody, setItemBody] = useState<string>("");
  const [itemTitle, setItemTitle] = useState<string>("");

  const { sendRequest, setData, setSelectedResource } = useResourcesContext();

  const areInputsValid = (): boolean => {
    if (resourceName === "todos") {
      if (!itemTitle) {
        return false;
      }
    } else if (resourceName === "posts" || resourceName === "comments") {
      if (!itemTitle || !itemBody) {
        return false;
      }
    }

    return true;
  };

  const postItemBasedOnResourceName = async (): Promise<void> => {
    const resourcePayloads: { [key: string]: object } = {
      todos: {
        completed: false,
        title: itemTitle,
      },
      posts: {
        body: itemBody,
        title: itemTitle,
        userId: Math.floor(Math.random() * 100),
      },
      comments: {
        body: itemBody,
        name: itemTitle,
      },
    };

    const body = resourcePayloads[resourceName];

    if (body) {
      await sendRequest({
        body,
        method: HTTPMethods.POST,
        resourceName,
      });
    }
  };

  return (
    <>
      <Form.Group className="d-flex justify-content-center align-items-center mb-0 p-2">
        <ClayInput
          id="add-todo-input"
          placeholder="Add new item here..."
          type="text"
          value={itemTitle}
          onChange={(e) => setItemTitle(e.target.value)}
        />

        {(resourceName === "posts" || resourceName === "comments") && (
          <ClayInput
            className="ml-2"
            id="add-item-body"
            placeholder="Insert body text..."
            type="text"
            value={itemBody}
            onChange={(e) => setItemBody(e.target.value)}
          />
        )}
      </Form.Group>

      <Button.Group>
        <Button
          className="mr-2"
          onClick={async () => {
            if (!areInputsValid()) {
              setAlert(true);
              return;
            }

            await postItemBasedOnResourceName();

            if (alert) setAlert(false);
            setItemTitle("");
            setItemBody("");
          }}
          type="submit"
        >
          {"Add item"}
        </Button>

        <Button
          onClick={() => {
            if (alert) setAlert(false);
            setData([]);
            setSelectedResource("");
          }}
          displayType="secondary"
        >
          {"Clear Data"}
        </Button>
      </Button.Group>

      {alert && (
        <ClayAlert
          displayType="danger"
          title="Please fill the required field(s)"
          variant="feedback"
        />
      )}
    </>
  );
};

export default ItemInput;
