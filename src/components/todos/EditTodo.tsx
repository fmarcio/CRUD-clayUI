import React, { useEffect, useRef, useState } from "react";
import Alert from "@clayui/alert";
import Form, { ClayInput } from "@clayui/form";
import { HTTPMethods } from "../../hooks/useRequest";
import { useRequestContext } from "../../hooks/useRequestContext";
import Button from "@clayui/button";

interface IEditTodoProps {
  completed: boolean;
  id: number;
  isEditActive: boolean;
  setIsEditActive: (isActive: boolean) => void;
}

const EditTodo: React.FC<IEditTodoProps> = ({
  completed,
  id,
  isEditActive,
  setIsEditActive,
}) => {
  const [alert, setAlert] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { sendRequest } = useRequestContext();

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEditTodo = async () => {
    if (!value) {
      setAlert(true);

      return;
    }

    await sendRequest({
      body: {
        completed,
        title: value,
      },
      id,
      method: HTTPMethods.PATCH,
      resourceName: "todos",
    });

    if (isMounted.current) {
      setIsEditActive(false);
    }
  };

  return (
    <>
      {isEditActive ? (
        <>
          {alert && (
            <Alert
              displayType="danger"
              title="Please insert a title"
              variant="feedback"
            />
          )}

          <Form.Group className="d-flex justify-content-center align-items-center mb-0 p-2">
            <ClayInput
              id="basicInputText"
              placeholder="New title here"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Button className="m-1" onClick={handleEditTodo} type="submit">
              {"Finish"}
            </Button>
          </Form.Group>

          <Button
            className="m-2"
            displayType="secondary"
            onClick={() => setIsEditActive(false)}
          >
            {"Cancel"}
          </Button>
        </>
      ) : (
        <Button
          className="m-2"
          displayType="secondary"
          onClick={() => {
            setIsEditActive(true);
          }}
        >
          {"Edit todo"}
        </Button>
      )}
    </>
  );
};

export default EditTodo;
