import fs from "fs";
import path from "path";

const requestFilePath = path.join("src", "api-swagger", "core", "request.ts");

// Read the file
const content = fs.readFileSync(requestFilePath, "utf8");

// Add timeout to the requestConfig
const modifiedContent = content.replace(
  /const requestConfig: AxiosRequestConfig = {([^}]*)}/,
  `const requestConfig: AxiosRequestConfig = {
    $1
    timeout: 10000, // 10 seconds timeout
  }`
);

// Write the modified content back
fs.writeFileSync(requestFilePath, modifiedContent);

console.log("Successfully added timeout to request configuration");
