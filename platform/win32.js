var iconv = require("iconv-lite");
var path = require("path");

var pshPaste = "\"[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((((new-object -ComObject 'htmlfile').parentWindow.clipboardData.getData('Text') -replace '`r|`n',''))))\""

var paste = { command: "powershell", args: [ "-NoProfile", "-c", pshPaste ] };
paste.full_command = [ paste.command, paste.args[0], pshPaste ].join(" ");

exports.copy = { command: "clip", args: [] };
exports.paste = paste;

exports.encode = function(str) { return iconv.encode(str, "utf16le") };
exports.decode = function(chunks) {
	if(!Array.isArray(chunks)) { chunks = [ chunks ]; }

	var b64 = iconv.decode(Buffer.concat(chunks), "cp437");
	b64 = b64.substr(0, b64.length - 2); // Chops off extra "\r\n"
    if (typeof Buffer.from === "function"){
        // Use Node 5.10+ safe method
        var result = Buffer.from(b64, "base64").toString('utf8');  
    } else {
        var result = new Buffer(b64, "base64").toString('utf8');  
    }
      
    return result;
};
