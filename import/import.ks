runOncePath("0:lib/core/util/string/quote.around.ks").
runOncePath("0:lib/core/fs/cache.ks").
runOncePath("0:lib/core/fs/file.ks").

clearCache().
global anonymous is false.

local import is open("import.ks").
import:clear().
import:writeln("runOncePath(" + quoteAround("0:import/import.ks") + ").").

local function importFolder {
    parameter folder.

    cd(folder).

    list files in fileList.

    for file in fileList {
        if (file:isFile) {
            import:writeln("runOncePath(" + quoteAround(folder + "/" + file:name) + ").").
        }
        else if (folder + "/" + file:name <> "0:lib/core" and file:name[0] <> ".") {
            importFolder(folder + "/" + file:name).
        }
    }

    cd("..").
}

importFolder("0:lib/core").
importFolder("0:lib").

import:writeln("runOncePath(" + quoteAround("init") + ").").

local cache is newCacheFile().
cache:write(import:readall:string).
runCacheFile(cache).