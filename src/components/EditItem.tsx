import React, { useEffect, useRef, useState } from "react";
import ClayAlert from "@clayui/alert";
import Form, { ClayInput } from "@clayui/form";
import Button from "@clayui/button";
import { HTTPMethods } from "../hooks/useRequest";
import {
  type ApiResourceItem,
  areInputsValid,
  isAlbum,
  isComment,
  isPhoto,
  isPost,
  isTodo,
  isUser,
} from "../utils/utils";
import { useResourcesContext } from "../hooks/useResourcesContext";

interface IEditItemProps {
  item: ApiResourceItem;
  isEditActive: boolean;
  setIsEditActive: (isActive: boolean) => void;
}

const getInitialTitle = (item: ApiResourceItem): string => {
  if (isTodo(item) || isPost(item) || isAlbum(item) || isPhoto(item)) {
    return item.title;
  }
  if (isComment(item) || isUser(item)) {
    return item.name;
  }
  return "";
};

const getInitialBody = (item: ApiResourceItem): string => {
  if (isPost(item) || isComment(item)) {
    return item.body;
  }
  return "";
};

const EditItem: React.FC<IEditItemProps> = ({
  item,
  isEditActive,
  setIsEditActive,
}) => {
  const [alert, setAlert] = useState<boolean>(false);
  const [itemTitle, setItemTitle] = useState<string>(() =>
    getInitialTitle(item)
  );
  const [itemBody, setItemBody] = useState<string>(() => getInitialBody(item));

  const { sendRequest, selectedResource: resourceName } = useResourcesContext();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleUpdate = async () => {
    if (!areInputsValid({ resourceName, itemBody, itemTitle })) {
      setAlert(true);
      return;
    }

    const payloadMap: { [key: string]: object } = {
      todos: { ...item, title: itemTitle },
      posts: { ...item, title: itemTitle, body: itemBody },
      comments: { ...item, name: itemTitle, body: itemBody },
      albums: { ...item, title: itemTitle },
      photos: { ...item, title: itemTitle },
      users: { ...item, name: itemTitle },
    };

    const body = payloadMap[resourceName];

    if (body) {
      await sendRequest({
        body,
        id: item.id,
        method: HTTPMethods.PATCH,
        resourceName,
      });
    }

    if (isMounted.current) {
      setIsEditActive(false);
    }
  };

  const showBodyInput = resourceName === "posts" || resourceName === "comments";

  return (
    <>
      {isEditActive ? (
        <>
          {alert && (
            <ClayAlert
              displayType="danger"
              title="Please fill the required field(s)"
              variant="feedback"
            />
          )}

          <Form.Group className="d-flex flex-column justify-content-center align-items-center mb-0 p-2">
            <ClayInput
              className="mb-2"
              id={`edit-item-title-${item.id}`}
              placeholder="New title here"
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
            />

            {showBodyInput && (
              <ClayInput
                id={`edit-item-body-${item.id}`}
                placeholder="New body here"
                type="text"
                value={itemBody}
                onChange={(e) => setItemBody(e.target.value)}
              />
            )}

            <Button.Group className="mt-2">
              <Button className="m-1" onClick={handleUpdate} type="submit">
                {"Finish"}
              </Button>

              <Button
                className="m-1"
                displayType="secondary"
                onClick={() => {
                  if (alert) setAlert(false);
                  setIsEditActive(false);
                }}
              >
                {"Cancel"}
              </Button>
            </Button.Group>
          </Form.Group>
        </>
      ) : (
        <Button
          className="m-2"
          displayType="secondary"
          onClick={() => setIsEditActive(true)}
        >
          {`Edit ${resourceName ? resourceName.slice(0, -1) : "Item"}`}
        </Button>
      )}
    </>
  );
};

export default EditItem;
