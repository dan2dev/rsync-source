import { sync, copyFolderTo, replaceManyInDir } from "../src/rsync-source";
(async () => {
    await copyFolderTo("./some-folder", "./some-other-folder", false);
    await replaceManyInDir("./some-other-folder", [
        ["baseCollection", "anotherBaseCollection"]
    ]);
})();
