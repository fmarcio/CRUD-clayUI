import Button from "@clayui/button";
import Form, { ClayInput } from "@clayui/form";
import { HTTPMethods } from "../../hooks/useRequest";
import { useRequestContext } from "../../hooks/useRequestContext";

interface IAddTodoProps {
  setValue: (val: string) => void;
  value: string;
}

const AddTodoInput = ({ setValue, value }: IAddTodoProps) => {
  const { sendRequest } = useRequestContext();

  return (
    <Form.Group className="d-flex justify-content-center align-items-center mb-0 p-4">
      <ClayInput
        id="basicInputText"
        placeholder="Add new todo here.."
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button
        className="ml-2"
        displayType="secondary"
        onClick={async () => {
          await sendRequest({
            body: {
              title: value,
              completed: false,
            },
            method: HTTPMethods.POST,
            resourceName: "todos",
          });

          setValue("");
        }}
        type="submit"
      >
        {"Add todo"}
      </Button>
    </Form.Group>
  );
};

export default AddTodoInput;
