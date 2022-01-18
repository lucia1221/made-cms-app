import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import { useCallback, useEffect, useState } from "react";
import { Loader, X } from "react-feather";
import { LinksFunction, useFetcher } from "remix";
import { Tag } from "~/models/tag";
import styles from "./tag-input.css";

export const links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: styles }];
};

interface Props {
  autoFocus?: boolean;

  name: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute;
}

function isEqualStringCaseInsensitive(a: string) {
  return function (b: string): boolean {
    return a.toLocaleLowerCase() === b.toLocaleLowerCase();
  };
}

function isKey(realValue: string) {
  return isEqualStringCaseInsensitive(realValue);
}

function isAnyOfKeys(realValue: string) {
  return function (...expectedValue: string[]) {
    return expectedValue.some(isKey(realValue));
  };
}

export const TagInput: React.FC<Props> = (props) => {
  /**
   * Internal state
   */
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<string[]>([]);

  const pushToSelection = useCallback(
    (val: string) => {
      setSelection((current) =>
        current.includes(val) ? current : [...current, val],
      );
    },
    [setSelection],
  );

  const popFromSelection = useCallback(
    (idx: number) => {
      setSelection((current) => current.filter((_, i) => i !== idx));
    },
    [setSelection],
  );

  /**
   * Remote match based on search term
   */
  const fetcher = useFetcher<Tag[]>();

  const data = (fetcher.data ?? [])
    .map((tag) => tag.value)
    .filter((val) => selection.includes(val) === false);

  const noMatchOnRemote =
    fetcher.state === "idle" && data.length === 0 && search.trim().length > 0;

  useEffect(() => {
    if (search.trim().length > 0) {
      fetcher.load(`/admin/tags?search=${search}`);
    }
  }, [search]);

  return (
    <Combobox>
      <div className="tag-pill-container">
        {selection.map((val, idx) => (
          <TagView
            name={props.name}
            key={idx}
            value={val}
            onRequestPop={() => popFromSelection(idx)}
          />
        ))}
        <ComboboxInput
          type={props.type}
          autoFocus={props.autoFocus}
          placeholder={props.placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.trimLeft().replace(/\s\s+/g, " "));
          }}
          onKeyDown={(e) => {
            const value = e.currentTarget.value.trim();

            if (isKey(e.code)("enter")) {
              e.preventDefault();

              if (value.length > 0) {
                pushToSelection(value);
                setSearch("");
              }
            }
          }}
        />
        {fetcher.state === "loading" && <Loader className="tag-input-loader" />}
      </div>

      <ComboboxPopover>
        <ComboboxList>
          {data.map((val, idx) => (
            <ComboboxOption key={idx} value={val} />
          ))}
          {noMatchOnRemote && (
            <ComboboxOption value={search}>
              Add <b>{search}</b> tag
            </ComboboxOption>
          )}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

interface TagViewProps {
  name: string;
  value: string;
  onRequestPop: () => void;
}

const TagView: React.FC<TagViewProps> = (props) => {
  return (
    <div className="tag-pill">
      <input
        type="hidden"
        name={`${props.name}[]`}
        defaultValue={props.value}
      />
      <span>{props.value}</span>
      <X
        className="tag-pill-destroy"
        onClick={props.onRequestPop}
        tabIndex={0}
        onKeyUp={(e) => {
          if (isAnyOfKeys(e.code)("enter", "backspace", "delete")) {
            props.onRequestPop();
          }
        }}
      />
    </div>
  );
};
