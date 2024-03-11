import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useRef } from "react";
import { Fact } from "../types/app.type";
import { Button, Div, NavIdProps, Panel, PanelHeader } from "@vkontakte/vkui";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

export const FirstPage: FC<NavIdProps> = ({ id }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const routeNavigator = useRouteNavigator();

  const fetchData = async (): Promise<Fact> => {
    const response = await fetch("https://catfact.ninja/fact");
    return await response.json();
  };

  const { data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
    enabled: false,
  });

  const handleClick = async () => {
    await refetch();
  };

  useEffect(() => {
    if (data && ref.current && data.fact) {
      const textarea = ref.current;
      const firstWord = data.fact.indexOf(" ");
      textarea.setSelectionRange(firstWord, firstWord);
      textarea.focus();
    }
  }, [data]);

  return (
    <Panel id={id}>
      <PanelHeader>
        <Button
          size="l"
          mode="secondary"
          onClick={() => routeNavigator.push("second")}
        >
          Второе задание
        </Button>
      </PanelHeader>

      <Div
        style={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          onClick={handleClick}
          appearance="accent"
          rounded
          style={{ marginBlock: "10px" }}
        >
          Click me
        </Button>
        <textarea
          ref={ref}
          value={data?.fact}
          style={{
            display: "block",
            width: "300px",
            height: "150px",
            resize: "none",
          }}
        />
      </Div>
    </Panel>
  );
};
