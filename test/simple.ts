import { sync, copyFolderTo, replaceManyInDir } from "../src/rsync-source";
(async () => {
    /*
    await sync({
        source: "../rsync-source-test",
        dest: "./test/some-other-folder",
        folders: ["sub1", "sub2"],
        del: true
    });
    */
    await copyFolderTo("./test/some-folder", "./test/some-other-folder/something/s", false);
    await replaceManyInDir("./some-other-folder", [
        ["baseCollection", "anotherBaseCollection"]
    ]);
    console.log("done");
})();
