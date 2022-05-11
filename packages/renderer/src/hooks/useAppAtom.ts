import { useRecoilState } from "recoil";

import { getAppAtom, saveLocalStorage, updateAppData } from "@/state";

function useAppAtom(key: string) {
  const appAtom = getAppAtom(key);

  if (appAtom) {
    const [value, setter] = useRecoilState(appAtom);

    return [
      value,
      (valueOrFn: any) => {
        if (typeof valueOrFn === "function") {
          return setter((currentValue: any) => {
            const value = valueOrFn(currentValue);

            updateAppData(key, value);
            saveLocalStorage();
            return value;
          });
        }

        updateAppData(key, valueOrFn);
        saveLocalStorage();
        return setter(valueOrFn);
      },
    ];
  }

  console.log(`App atom for '${key}' does not exist.`);
  return [null, () => null];
}

export { useAppAtom };
