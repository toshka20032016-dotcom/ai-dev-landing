const fs = require("fs");
const path = require("path");

function decodeUtf16Mojibake(text) {
  const bytes = [];
  for (const char of text) {
    const code = char.charCodeAt(0);
    bytes.push(code & 0xff);
    if (code > 0xff) bytes.push(code >> 8);
  }

  return Buffer.from(bytes).toString("utf8");
}

function fixUtf16(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !["node_modules", ".next"].includes(ent.name)) fixUtf16(p);
    else if (/\.tsx?$/.test(ent.name)) {
      const b = fs.readFileSync(p);
      if (b.length > 1 && b[1] === 0) fs.writeFileSync(p, fs.readFileSync(p, "utf16le"), "utf8");
      else {
        const text = b.toString("utf8");
        if (text.startsWith("產敳挠楬湥") || text.startsWith("浩潰瑲")) {
          fs.writeFileSync(p, decodeUtf16Mojibake(text), "utf8");
        }
      }
    }
  }
}

fixUtf16(path.join(__dirname, "..", "src"));
