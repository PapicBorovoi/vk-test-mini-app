import { FC, useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Button,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import * as yup from "yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

const useYupValidationResolver = (
  validationSchema: yup.ObjectSchema<{ name: string }>
) =>
  useCallback(
    async (data: { name: string }) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        if (!(errors instanceof yup.ValidationError)) {
          throw errors;
        }
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path!]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

const validationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z]+$/)
    .required("Name is required"),
});

export const SecondPage: FC<NavIdProps> = ({ id }) => {
  const [name, setName] = useState<string>("");
  const { register, handleSubmit, watch } = useForm({
    resolver: useYupValidationResolver(validationSchema),
  });
  const nameValue = watch("name");
  const queryClient = useQueryClient();
  const routeNavigator = useRouteNavigator();

  const fetchAge = async (signal: AbortSignal): Promise<number> => {
    if (isPending) {
      queryClient.cancelQueries({ queryKey: ["data"] });
    }
    const response = await fetch(`https://api.agify.io/?name=${nameValue}`, {
      signal,
    });
    const responseObj = await response.json();
    return responseObj.age;
  };

  const { data, refetch, isPending } = useQuery({
    queryKey: ["data"],
    queryFn: ({ signal }) => fetchAge(signal),
    enabled: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nameValue !== name && nameValue !== "") {
        setName(nameValue);
        refetch();
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [nameValue, name]);

  const onSubmit = async (data: FieldValues) => {
    if (data.name === name || data.name === "") {
      return;
    }

    setName(data.name);
    refetch();
  };

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        назад
      </PanelHeader>

      <form
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="text" placeholder="Name" {...register("name")} />
        {data && <p>{`your age is ${data}`}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </Panel>
  );
};
