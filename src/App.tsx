import { View, SplitLayout, SplitCol } from "@vkontakte/vkui";
import { useActiveVkuiLocation } from "@vkontakte/vk-mini-apps-router";
import { DEFAULT_VIEW_PANELS } from "./routes";
import { FirstPage } from "./panels/firstPage";
import { SecondPage } from "./panels/secondPage";

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.FIRST } =
    useActiveVkuiLocation();

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <FirstPage id={DEFAULT_VIEW_PANELS.FIRST} />
          <SecondPage id={DEFAULT_VIEW_PANELS.SECOND} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
