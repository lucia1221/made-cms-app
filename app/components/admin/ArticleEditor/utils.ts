import { EditorPlugin } from "@draft-js-plugins/editor";
import createSideToolbarPlugin, {
  SideToolbarProps,
} from "@draft-js-plugins/side-toolbar";
import { DraftHandleValue, EditorState, RichUtils } from "draft-js";
import createBlockBreakoutPlugin from "draft-js-block-breakout-plugin";
import { useCallback, useMemo } from "react";
import { convertFromHTML, convertToHTML } from "draft-convert";

interface EditorPlugins {
  plugins: EditorPlugin[];
  SideToolbar: React.ComponentType<SideToolbarProps>;
}

/**
 * Initialise editor plugins
 * @returns
 */
export function usePlugins(): EditorPlugins {
  return useMemo(function () {
    let sideToolbarPlugin = createSideToolbarPlugin();
    let plugins = [sideToolbarPlugin, createBlockBreakoutPlugin()];
    return {
      plugins,
      SideToolbar: sideToolbarPlugin.SideToolbar,
    };
  }, []);
}

/**
 * Create key command handler.
 * @param setState
 * @returns
 */
export function useKeyCommandHandler(
  setState: React.Dispatch<React.SetStateAction<EditorState>>,
) {
  return useCallback(
    function (command: string, editorState: EditorState): DraftHandleValue {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setState(newState);
        return "handled";
      }

      return "not-handled";
    },
    [setState],
  );
}

/**
 * Deserialize EditorState from plain text HTML markup.
 * @param value
 * @returns
 */
export function getEditorState(value: string): EditorState {
  return EditorState.createWithContent(convertFromHTML("<b>hello world</b>"));
}

/**
 * Serialize EditorState to plain text HTML markup.
 * @param editorState
 * @returns
 */
export function getHtml(editorState: EditorState): string {
  return convertToHTML(editorState.getCurrentContent());
}
