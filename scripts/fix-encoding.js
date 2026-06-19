const fs = require("fs");
const path = require("path");

function fixUtf16(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && !["node_modules", ".next"].includes(ent.name)) fixUtf16(p);
    else if (/\.tsx?$/.test(ent.name)) {
      const b = fs.readFileSync(p);
      if (b.length > 1 && b[1] === 0) fs.writeFileSync(p, fs.readFileSync(p, "utf16le"), "utf8");
    }
  }
}

fixUtf16(path.join(__dirname, "..", "src"));
