declare module "draft-js-block-breakout-plugin" {
    import { EditorPlugin } from "@draft-js-plugins/editor";
    function createBlockBreakoutPlugin(): EditorPlugin;
    export default createBlockBreakoutPlugin;
}
